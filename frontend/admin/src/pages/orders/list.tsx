import {
  OrderStatusTag,
  PaymentMethodTag,
  PaymentStatusTag,
} from '@/components/atoms';
import { PageTemplate } from '@/components/templates';
import { formatDate, formatVND } from '@/lib/utils';
import {
  Order,
  OrderOverview,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '@/types';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { ShowButton, useTable } from '@refinedev/antd';
import { useCustom, useUpdate } from '@refinedev/core';
import {
  Button,
  Card,
  DatePicker,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import { useState } from 'react';

const PAYMENT_STATUS_OPTIONS = [
  { label: 'Paid', value: 'paid' },
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Refunded', value: 'refunded' },
];

const ORDER_STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Shipping', value: 'shipping' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const OrderList = () => {
  const { result: orderOverviewResult } = useCustom<OrderOverview>({
    url: import.meta.env.VITE_ORDERS_OVERVIEW_ENDPOINT,
    method: 'get',
  });
  const { tableProps, setFilters } = useTable({
    sorters: { initial: [{ field: 'createdAt', order: 'desc' }] },
    syncWithLocation: false,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [editing, setEditing] = useState<Order | null>();
  const [updateValues, setUpdateValues] = useState<any>();

  const overview = [
    {
      title: 'Total',
      value: orderOverviewResult.data.totalOrders,
      color: 'blue',
    },
    {
      title: 'Revenue',
      value: formatVND(orderOverviewResult.data.revenue),
      color: 'green',
    },
    {
      title: 'Complete',
      value: orderOverviewResult.data.completeCount,
      color: 'orange',
    },
    {
      title: 'Cancelled',
      value: orderOverviewResult.data.cancelledCount,
      color: 'red',
    },
  ];

  const { mutate: update } = useUpdate();

  return (
    <PageTemplate overview={overview}>
      <Card>
        <div className='flex justify-between gap-10'>
          <Input
            placeholder='Search by code'
            prefix={<SearchOutlined />}
            className='!max-w-[250px]'
            onChange={(e) =>
              setFilters([
                {
                  field: 'orderCode',
                  operator: 'eq',
                  value: e.target.value || undefined,
                },
              ])
            }
          />

          <DatePicker.RangePicker
            size='small'
            onChange={(vals) => {
              setFilters([
                {
                  field: 'createdAt',
                  operator: 'gte',
                  value: vals?.[0]
                    ? vals[0].startOf('day').toISOString()
                    : undefined,
                },
                {
                  field: 'createdAt',
                  operator: 'lte',
                  value: vals?.[1]
                    ? vals[1].endOf('day').toISOString()
                    : undefined,
                },
              ]);
            }}
            format='DD/MM/YYYY'
            placeholder={['From date', 'To date']}
            style={{ width: 220 }}
          />

          <div className='flex items-center gap-3'>
            <span className='uppercase text-xs'>Order Status: </span>
            <Select
              placeholder='Order Status'
              options={[{ label: 'All', value: '' }, ...ORDER_STATUS_OPTIONS]}
              onChange={(value) =>
                setFilters([
                  {
                    field: 'orderStatus',
                    value: value || undefined,
                    operator: 'eq',
                  },
                ])
              }
              className='min-w-[120px]'
            />
          </div>

          <div className='flex items-center gap-3'>
            <span className='uppercase text-xs'>Payment Status: </span>
            <Select
              placeholder='Payment Status'
              options={[{ label: 'All', value: '' }, ...PAYMENT_STATUS_OPTIONS]}
              onChange={(value) =>
                setFilters([
                  {
                    field: 'paymentStatus',
                    value: value || undefined,
                    operator: 'eq',
                  },
                ])
              }
              className='min-w-[120px]'
            />
          </div>
        </div>
      </Card>

      <Table
        {...tableProps}
        loading={tableProps.loading}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
        rowKey={'id'}
      >
        <Table.Column title='Order Code' dataIndex={'orderCode'} />
        <Table.Column
          title='Total Amount'
          dataIndex={'totalAmount'}
          render={(value) => formatVND(value)}
        />
        <Table.Column title='Location' dataIndex={'city'} />
        <Table.Column
          title='Payment Method'
          dataIndex={'paymentMethod'}
          render={(value: PaymentMethod) => <PaymentMethodTag value={value} />}
        />
        <Table.Column
          title='Payment Status'
          dataIndex={'paymentStatus'}
          render={(value: PaymentStatus, record) => {
            if (record.id === editing?.id)
              return (
                <Select
                  options={PAYMENT_STATUS_OPTIONS}
                  defaultValue={value}
                  className='w-full'
                  onChange={(value) =>
                    setUpdateValues({ paymentStatus: value, ...updateValues })
                  }
                />
              );
            else return <PaymentStatusTag value={value} />;
          }}
        />
        <Table.Column
          title='Order Status'
          dataIndex={'orderStatus'}
          render={(value: OrderStatus, record) => {
            if (record.id === editing?.id)
              return (
                <Select
                  options={ORDER_STATUS_OPTIONS}
                  defaultValue={value}
                  className='w-full'
                  onChange={(value) =>
                    setUpdateValues({ orderStatus: value, ...updateValues })
                  }
                />
              );
            else return <OrderStatusTag value={value} />;
          }}
        />
        <Table.Column
          title='Order Date'
          dataIndex={'createdAt'}
          render={(value) => formatDate(value)}
        />
        <Table.Column
          align='center'
          render={(_, record: Order) => {
            if (editing?.id === record.id) {
              return (
                <Space>
                  <Button
                    size='small'
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => setEditing(null)}
                  />
                  <Button
                    size='small'
                    type='primary'
                    icon={<CheckOutlined />}
                    onClick={() =>
                      update(
                        {
                          resource: import.meta.env.VITE_ORDERS_ENDPOINT,
                          id: editing.id,
                          values: { ...updateValues },
                        },
                        {
                          onSuccess: () => setEditing(null),
                        },
                      )
                    }
                  />
                </Space>
              );
            } else
              return (
                <Space>
                  <Button
                    size='small'
                    icon={<EditOutlined />}
                    onClick={() => setEditing(record)}
                  />
                  <ShowButton hideText size='small' recordItemId={record.id} />
                </Space>
              );
          }}
        />
      </Table>
    </PageTemplate>
  );
};
