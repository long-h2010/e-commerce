import { api } from '@/lib/api/axios';
import {
  camelToSnake,
  transformKeysToCamelCase,
  transformKeysToSnakeCase,
} from '@/lib/utils';
import { Filter, Pagination, Sorter } from '@/types';
import { stringify } from 'querystring';

export const resourcesService = {
  getList: async ({
    resource,
    pagination = { page: 1, limit: 10 },
    filters = [],
    sorters = [],
    meta,
  }: {
    resource: string;
    pagination?: Pagination;
    filters?: Filter[];
    sorters?: Sorter[];
    meta?: any;
  }) => {
    const { page, limit } = pagination;
    const queryParams: Record<string, any> = {
      page: page,
      limit: limit,
    };

    filters.forEach((item) => {
      if ('field' in item && item.operator && item.value) {
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

    const { data } = await api.get(url, {
      headers: meta?.headers,
    });

    const transformData = transformKeysToCamelCase(data);

    return {
      data: transformData.founds ?? transformData,
      total: transformData.searchOptions.totalCount ?? 0,
    };
  },

  getOne: async ({
    resource,
    id,
    meta,
  }: {
    resource: string;
    id: string;
    meta?: any;
  }) => {
    const { data } = await api.get(`${resource}/${id}`, {
      headers: meta?.headers,
    });

    const transformData = transformKeysToCamelCase(data);

    return { data: transformData.data || transformData };
  },

  create: async ({
    resource,
    variables,
    meta,
  }: {
    resource: string;
    variables: any;
    meta?: any;
  }) => {
    try {
      let bodyData = variables;
      if (!(variables instanceof FormData))
        bodyData = transformKeysToSnakeCase(variables);

      const { data } = await api.post(`${resource}`, bodyData, {
        headers: meta?.headers,
      });

      return { data: transformKeysToCamelCase(data.data || data) };
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

  update: async ({
    resource,
    id,
    variables,
    meta,
  }: {
    resource: string;
    id: string;
    variables: any;
    meta?: any;
  }) => {
    let bodyData = variables;
    if (!(variables instanceof FormData))
      bodyData = transformKeysToSnakeCase(variables);

    const { data } = await api.put(`${resource}/${id}`, bodyData, {
      headers: meta?.headers,
    });
    return { data: transformKeysToCamelCase(data.data || data) };
  },

  deleteOne: async ({
    resource,
    id,
    meta,
  }: {
    resource: string;
    id: string;
    meta?: any;
  }) => {
    const { data } = await api.delete(`${resource}/${id}`, {
      headers: meta?.headers,
    });
    return { data: data.data || data };
  },
};
