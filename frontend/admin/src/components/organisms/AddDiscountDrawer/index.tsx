import { buildTreeData, formatVND } from '@/lib/utils';
import { DiscountApplyType, DiscountTargetType, DiscountType } from '@/types';
import { DollarOutlined, PercentageOutlined } from '@ant-design/icons';
import { useCreate, useList } from '@refinedev/core';
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Segmented,
  Select,
  Space,
  TreeSelect,
} from 'antd';
import type { SelectProps } from 'antd';

export const AddDiscountDrawer = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [form] = Form.useForm();
  const { mutate: createDiscount } = useCreate();

  const {
    result: { data: categories },
  } = useList({
    resource: import.meta.env.VITE_CATEGORIES_ENDPOINT,
  });
  const categoriesOptions = buildTreeData(
    categories.map((c) => ({
      id: c.id,
      label: c.category,
      value: c.id,
      parentId: c.parentId,
    })),
  );

  const {
    result: { data: products },
  } = useList({
    resource: import.meta.env.VITE_PRODUCTS_ENDPOINT,
  });
  const productOptions: SelectProps['options'] = products.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  const handleCreateDiscount = (values: any) => {
    if (!values) return;

    const [startTime, endTime] = values.period;
    values.startTime = startTime.toISOString();
    values.endTime = endTime.toISOString();

    createDiscount({
      resource: import.meta.env.VITE_DISCOUNTS_ENDPOINT,
      values: values,
    });
  };

  return (
    <Drawer
      title='New Discount'
      open={open}
      width={520}
      onClose={() => setOpen(false)}
      footer={
        <div className='flex justify-end gap-3 my-3'>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type='primary' onClick={() => form.submit()}>
            Create
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        className='flex flex-col gap-8'
        onFinish={handleCreateDiscount}
      >
        <div className='flex gap-10 justify-between'>
          <Form.Item
            label='Sale Name'
            name='name'
            layout='vertical'
            rules={[
              { required: true, message: `Discount's name is required!` },
            ]}
            className='w-[280px]'
          >
            <Input placeholder='e.g. Sale' />
          </Form.Item>
          <Form.Item
            label='Discount Code'
            name='code'
            layout='vertical'
            rules={[
              { required: true, message: `Discount's code is required!` },
            ]}
          >
            <Input placeholder='e.g. SALE' />
          </Form.Item>
        </div>
        <div className='flex gap-10 justify-between'>
          <Form.Item
            label='Discount Type'
            name='type'
            layout='vertical'
            initialValue={DiscountType.PERCENTAGE}
          >
            <Segmented
              options={[
                {
                  label: (
                    <Space>
                      <PercentageOutlined />
                      {DiscountType.PERCENTAGE}
                    </Space>
                  ),
                  value: DiscountType.PERCENTAGE,
                },
                {
                  label: (
                    <Space>
                      <DollarOutlined />
                      {DiscountType.FIXED}
                    </Space>
                  ),
                  value: DiscountType.FIXED,
                },
              ]}
              className='capitalize'
            />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => {
              const t = getFieldValue('type') as DiscountType;
              return (
                <Form.Item
                  label='Discount Value'
                  name='value'
                  layout='vertical'
                  rules={[
                    {
                      required: true,
                      message: `Discount's value is required!`,
                    },
                  ]}
                >
                  <InputNumber
                    placeholder='e.g. 10'
                    formatter={(value: any) =>
                      t == DiscountType.FIXED ? formatVND(value) : value
                    }
                    parser={(value: any) => {
                      if (!value) return;
                      return value.replace(/[^0-9]/g, '');
                    }}
                    suffix={t == DiscountType.PERCENTAGE ? '%' : ''}
                    className='!w-full'
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
        </div>
        <Form.Item
          label='Apply To'
          name='applyTo'
          rules={[
            {
              required: true,
              message: `Apply type is required!`,
            },
          ]}
        >
          <Select
            placeholder='Select apply type'
            options={[
              {
                label: 'Product',
                value: DiscountApplyType.PRODUCT,
              },
              {
                label: 'Order',
                value: DiscountApplyType.ORDER,
              },
              {
                label: 'Shipping Fee',
                value: DiscountApplyType.SHIPPING,
              },
            ]}
          />
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const at = getFieldValue('applyTo');
            if (at == DiscountApplyType.PRODUCT)
              return (
                <div className='flex gap-10 justify-between'>
                  <Form.Item
                    label='Target Type'
                    name='target'
                    layout='vertical'
                    initialValue={DiscountTargetType.CATEGORY}
                    className='w-[150px]'
                  >
                    <Select
                      options={[
                        {
                          label: 'Category',
                          value: DiscountTargetType.CATEGORY,
                        },
                        {
                          label: 'Product',
                          value: DiscountTargetType.PRODUCT,
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item shouldUpdate noStyle>
                    {({ getFieldValue }) => {
                      const target = getFieldValue('target');
                      return (
                        <Form.Item
                          label={target}
                          name='target_ids'
                          layout='vertical'
                          className='w-full capitalize'
                        >
                          {target == DiscountTargetType.CATEGORY ? (
                            <TreeSelect
                              multiple
                              placeholder='Empty = apply for all category'
                              treeData={categoriesOptions}
                              className='capitalize'
                            />
                          ) : (
                            <Select
                              mode='multiple'
                              placeholder='Empty = apply for all product'
                              options={productOptions}
                              className='capitalize'
                            />
                          )}
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </div>
              );
            return null;
          }}
        </Form.Item>
        <Form.Item
          label='Sale Period'
          name='period'
          rules={[{ required: true, message: 'Select date range' }]}
        >
          <DatePicker.RangePicker format='DD MM YYYY' className='w-full' />
        </Form.Item>
        <div className='flex gap-4 justify-between'>
          <Form.Item
            label='Min. Order Value'
            name='minOrder'
            layout='vertical'
            initialValue={0}
          >
            <InputNumber
              formatter={(value: any) => formatVND(value)}
              parser={(value: any) => {
                if (!value) return;
                return value.replace(/[^0-9]/g, '');
              }}
              step={100000}
              className='!w-full'
            />
          </Form.Item>
          <Form.Item label='Usage Limit' name='usageLimit' layout='vertical'>
            <Input placeholder='Empty = unlimited' />
          </Form.Item>
          <Form.Item label='Usage Per User' name='usagePerUser' layout='vertical'>
            <Input placeholder='Empty = 1' />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};
