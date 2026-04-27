import { ProductDetailTemplate } from '@/components/templates';
import { useHeaderStore } from '@/stores';
import { ProductDetail } from '@/types';
import { useForm } from '@refinedev/antd';
import {
  useGo,
  useInvalidate,
  useParsed,
  useResourceParams,
  useUpdate,
} from '@refinedev/core';
import { Empty, Form, Skeleton, Spin } from 'antd';
import { useEffect } from 'react';
import _ from 'lodash';
import { camelToSnake } from '@/lib/utils';
import { LoadingOutlined } from '@ant-design/icons';

export const ProductEdit = () => {
  const { setState, clearState } = useHeaderStore();
  const go = useGo();
  const { id } = useParsed();
  const { resource } = useResourceParams();
  const { mutate: updateProduct, mutation } = useUpdate();
  const invalidate = useInvalidate();

  const { form, query, formProps, onFinish } = useForm<ProductDetail>({
    action: 'edit',
    queryOptions: {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 100,
      queryKey: ['products', 'detail', id],
    },
    redirect: false,
  });

  const productInit = formProps.initialValues as ProductDetail;

  const handleUpdate = (values: any) => {
    const dataChange = new FormData();

    Object.keys(values).forEach((key) => {
      if (key == 'images') {
        const imgsChange = values[key].filter((img: any) => img.file !== null);

        if (imgsChange.length > 0)
          imgsChange.forEach((img: any) => {
            dataChange.append('images', img.file);
          });
      } else if (Array.isArray(values[key])) {
        values[key].forEach((item: any) => {
          dataChange.append(camelToSnake(key), item);
        });
      } else if (!_.isEqual((productInit as any)[key], values[key]))
        dataChange.append(camelToSnake(key), values[key]);
    });

    if ([...dataChange.entries()].length == 0)
      go({
        to: {
          resource: resource?.name!,
          action: 'show',
          id: id!,
        },
      });
    else {
      updateProduct(
        {
          resource: import.meta.env.VITE_PRODUCTS_ENDPOINT,
          values: dataChange,
          id: id,
        },
        {
          onSuccess: async () => {
            await onFinish(values);
            await invalidate({
              resource: resource?.name!,
              invalidates: ['detail'],
              id: id,
            });

            go({
              to: {
                resource: resource?.name!,
                action: 'show',
                id: id!,
              },
            });
          },
        },
      );
    }
  };

  useEffect(() => {
    setState('Save', 'save', () => form.submit());
    return () => clearState();
  }, []);

  if (query?.isLoading) return <Skeleton />;

  if (!query?.data) return <Empty />;

  return (
    <Spin
      indicator={<LoadingOutlined spin />}
      size='large'
      spinning={mutation.isPending}
    >
      <Form {...formProps} onFinish={(values) => handleUpdate(values)}>
        <ProductDetailTemplate
          form={formProps.form}
          action={'edit'}
          product={productInit}
        />
      </Form>
    </Spin>
  );
};
