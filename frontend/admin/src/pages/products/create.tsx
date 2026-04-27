import { ProductDetailTemplate } from '@/components/templates';
import { camelToSnake } from '@/lib/utils';
import { useHeaderStore } from '@/stores';
import { LoadingOutlined } from '@ant-design/icons';
import { useCreate, useGo, useResourceParams } from '@refinedev/core';
import { Form, Spin } from 'antd';
import { useEffect } from 'react';

export const ProductCreate = () => {
  const go = useGo();
  const { setState, clearState } = useHeaderStore();
  const { resource } = useResourceParams();
  const [form] = Form.useForm();
  const { mutate: createProduct, mutation } = useCreate();

  const handleCreateproduct = (values: any) => {
    if (!values) return;

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key !== 'images' && value !== undefined && value !== null) {
        formData.append(camelToSnake(key), String(value));
      }
    });

    if (Array.isArray(values.images)) {
      values.images.forEach((img: any) => {
        if (img.file instanceof File) {
          formData.append('images', img.file);
        }
      });
    }

    createProduct(
      {
        resource: import.meta.env.VITE_PRODUCTS_ENDPOINT,
        values: formData,
      },
      {
        onSuccess: () => {
          form.resetFields();
          go({
            to: {
              resource: resource?.name!,
              action: 'list',
            },
          });
        },
      },
    );
  };

  useEffect(() => {
    setState('Save', 'save', () => form.submit());
    return () => clearState();
  }, []);

  return (
    <Spin
      indicator={<LoadingOutlined spin />}
      size='large'
      spinning={mutation.isPending}
    >
      <Form form={form} onFinish={(values) => handleCreateproduct(values)}>
        <ProductDetailTemplate form={form} action={'create'} />
      </Form>
    </Spin>
  );
};
