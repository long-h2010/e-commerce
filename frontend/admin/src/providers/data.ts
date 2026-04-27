import { api } from '@/lib/api/axios';
import {
  camelToSnake,
  transformKeysToCamelCase,
  transformKeysToSnakeCase,
} from '@/lib/utils';
import { DataProvider } from '@refinedev/core';
import { AxiosInstance } from 'axios';
import { stringify } from 'query-string';

const axiosInstance: AxiosInstance = api;

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance,
): DataProvider => ({
  getList: async ({
    resource,
    pagination,
    filters = [],
    sorters = [],
    meta,
  }) => {
    const { currentPage = 1, pageSize = 10 } = pagination ?? {};

    const queryParams: Record<string, any> = {
      page: currentPage,
      limit: pageSize,
    };

    filters.forEach((item) => {
      if ('field' in item && item.operator && item.value !== undefined) {
        const { field, operator, value } = item;
        const f = camelToSnake(field);

        if (operator == 'eq') queryParams[f] = value;
        else queryParams[f] = value;
      }
    });

    if (sorters.length > 0) {
      const sortArray: string[] = [];

      sorters.forEach((sorter) => {
        const prefix = sorter.order === 'desc' ? '-' : '';
        sortArray.push(`${prefix}${camelToSnake(sorter.field)}`);
      });

      queryParams.sort = sortArray.join(',');
    }

    const url = `/${resource}?${stringify(queryParams)}`;

    const { data } = await httpClient.get(url, {
      headers: meta?.headers,
    });

    const transformData = transformKeysToCamelCase(data);

    return {
      data: transformData.founds ?? transformData,
      total:
        transformData.total ??
        transformData.length ??
        transformData.searchOptions.totalCount ??
        0,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    const { data } = await httpClient.get(`${apiUrl}/${resource}/${id}`, {
      headers: meta?.headers,
    });

    const transformData = transformKeysToCamelCase(data);

    return { data: transformData.data || transformData };
  },

  create: async ({ resource, variables, meta }) => {
    try {
      let bodyData = variables;
      if (!(variables instanceof FormData))
        bodyData = transformKeysToSnakeCase(variables);

      const { data } = await httpClient.post(
        `${apiUrl}/${resource}`,
        bodyData,
        {
          headers: meta?.headers,
        },
      );

      return { data: data.data || data };
    } catch (error: any) {
      const res = error.response;
      const message =
        res?.data?.detail || res?.data?.message || 'Create failed';

      throw {
        message,
        statusCode: res?.status,
        errors: res?.data,
      };
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    let bodyData = variables;
    if (!(variables instanceof FormData))
      bodyData = transformKeysToSnakeCase(variables);

    const { data } = await httpClient.put(
      `${apiUrl}/${resource}/${id}`,
      bodyData,
      { headers: meta?.headers },
    );
    return { data: data.data || data };
  },

  deleteOne: async ({ resource, id, meta }) => {
    const { data } = await httpClient.delete(`${apiUrl}/${resource}/${id}`, {
      headers: meta?.headers,
    });
    return { data: data.data || data };
  },

  custom: async ({ url, method, payload, query, headers, meta }) => {
    const requestUrl = url.startsWith('http') ? url : `${apiUrl}/${url}`;

    const { data } = await axiosInstance({
      url: requestUrl,
      method: method || 'get',
      data: payload,
      params: query,
      headers: {
        ...headers,
        ...(meta?.headers || {}),
      },
    });

    return { data };
  },

  getApiUrl: () => apiUrl,
});
