import { formatVND } from '@/lib/utils';
import { Color, ProductVariant } from '@/types';
import { useCreate, useList } from '@refinedev/core';
import {
  Alert,
  Button,
  ColorPicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd';
import type { SelectProps } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const SIZES_OPTIONS: SelectProps['options'] = SIZES.map((s) => ({ value: s }));

export const AddVariantDrawer = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [colorSelected, setColorSelected] = useState<Color>();
  const [sizes, setSizes] = useState<string[]>([]);

  const { mutate: createVariants } = useCreate();

  const {
    result: { data },
  } = useList({
    resource: import.meta.env.VITE_COLORS_ENDPOINT,
    pagination: { pageSize: 0 },
  });
  const colorOptions = data.map((c) => ({ label: c.name, value: c.id }));

  const handleAddVariants = (values: any) => {
    if (!values) return;

    createVariants(
      {
        resource: import.meta.env.VITE_PRODUCT_VARIANTS_ENDPOINT,
        values: values,
      },
      {
        onSuccess: () => {
          form.resetFields();
          setOpen(false);
        },
      },
    );
  };

  return (
    <Drawer
      title='Add Variants'
      placement='right'
      width={380}
      open={open}
      onClose={() => setOpen(false)}
      footer={
        <div className='flex justify-end gap-3 my-3'>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type='primary' onClick={() => form.submit()}>
            Add{' '}
            {sizes?.length > 0
              ? `${sizes.length} Variant${sizes.length > 1 ? 's' : ''}`
              : 'Variants'}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        onFinish={handleAddVariants}
        className='flex flex-col gap-5'
      >
        <Form.Item hidden name='productId' initialValue={id} />
        <Form.Item
          label='Color:'
          name='colorId'
          layout='vertical'
          rules={[{ required: true, message: `Variant's color is required` }]}
        >
          <div className='flex justify-between gap-10'>
            <Select
              size='large'
              placeholder='Select color to add…'
              options={colorOptions}
              onChange={(value) => {
                form.setFieldValue('colorId', value);
                setColorSelected(data.filter((c) => c.id == value)[0] as any);
              }}
            />
            <ColorPicker size='large' disabled value={colorSelected?.hex} />
          </div>
        </Form.Item>
        <Form.Item
          label='Sizes:'
          name='sizes'
          layout='vertical'
          rules={[{ required: true, message: `Variant's sizes is required` }]}
        >
          <Select
            mode='tags'
            size='large'
            placeholder='Select sizes to add…'
            options={SIZES_OPTIONS}
            value={sizes}
            onChange={(value) => setSizes(value)}
            className='min-w-[200px]'
          />
        </Form.Item>
        <Form.Item
          label='Sku:'
          name='sku'
          layout='vertical'
          rules={[{ required: true, message: `Variant's sku is required` }]}
        >
          <Input size='large' />
        </Form.Item>
        <Form.Item
          label='Cost for variant:'
          name='cost'
          layout='vertical'
          initialValue={0}
        >
          <InputNumber<number>
            size='large'
            className='!w-full'
            formatter={(value: any) => formatVND(value)}
            parser={(value: any) => {
              if (!value) return;
              return value.replace(/[^0-9]/g, '');
            }}
            step={100000}
          />
        </Form.Item>
        <Form.Item
          label='Price for variant:'
          name='price'
          layout='vertical'
          initialValue={0}
        >
          <InputNumber<number>
            size='large'
            className='!w-full'
            formatter={(value: any) => formatVND(value)}
            parser={(value: any) => {
              if (!value) return;
              return value.replace(/[^0-9]/g, '');
            }}
            step={100000}
          />
        </Form.Item>
        <Form.Item
          label='Stock:'
          name='stock'
          layout='vertical'
          initialValue={0}
        >
          <InputNumber size='large' className='!w-full' />
        </Form.Item>
        {sizes.length > 0 && colorSelected && (
          <Alert
            type='info'
            className='!mt-10'
            message={
              <div className='flex gap-2'>
                <span>{`${sizes.length} variant${
                  sizes.length > 1 ? 's' : ''
                } will be added for `}</span>
                <span
                  style={{ color: colorSelected.hex }}
                  className='font-semibold'
                >
                  {colorSelected.name}
                </span>
              </div>
            }
          />
        )}
      </Form>
    </Drawer>
  );
};
