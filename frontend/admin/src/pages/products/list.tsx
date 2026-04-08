import { OverViewStats } from '@/components/organisms';
import { formatNumberCount, formatVND } from '@/lib/utils';
import { ProductBase, ProductStatus, ProductStatusEnum } from '@/types';
import { SearchOutlined } from '@ant-design/icons';
import {
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from '@refinedev/antd';
import { useCustom } from '@refinedev/core';
import {
  Card,
  Divider,
  Image,
  Input,
  Segmented,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import { useState } from 'react';

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: ProductStatusEnum.ACTIVE },
  { label: 'Out of Stock', value: ProductStatusEnum.OUTSTOCK },
  { label: 'Draft', value: ProductStatusEnum.DRAFT },
];

export const ProductList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProductStatus | undefined>(
    undefined,
  );

  const { result: overviewData } = useCustom({
    url: import.meta.env.VITE_PRODUCTS_OVERVIEW_ENDPOINT,
    method: 'get',
  });

  const {
    total = 0,
    active = 0,
    out = 0,
    draft = 0,
  } = overviewData?.data || {};

  const overview = [
    { title: 'Total', value: total, color: 'blue' },
    { title: 'Active', value: active, color: 'green' },
    { title: 'Out Of Stock', value: out, color: 'red' },
    { title: 'Draft', value: draft, color: 'orange' },
  ];

  const { tableProps, setFilters } = useTable<ProductBase>({
    resource: 'products/list',
    filters: {
      permanent: [],
    },
    syncWithLocation: false,
  });

  const handleStatusChange = (value: ProductStatus | undefined) => {
    setStatusFilter(value);

    if (value) {
      setFilters([{ field: 'status', operator: 'eq', value }], 'replace');
    } else {
      setFilters([], 'replace');
    }
  };

  return (
    <div className='flex flex-col gap-10'>
      <OverViewStats stats={overview} />

      <Card>
        <div className='flex flex-col'>
          <div className='flex flex-col gap-3'>
            <span className='uppercase text-xs'>Filter by Category</span>
            <Segmented
              options={['All', 'Men', 'Women', 'Accessories']}
              className='w-fit'
            />
            <Segmented
              options={[
                'All',
                'Tops',
                'Bottoms',
                'Outerwear',
                'Dresses',
                'Accessories',
                'Footwear',
              ]}
              className='w-fit'
            />
          </div>
          <Divider />
          <div className='flex gap-10'>
            <Input
              placeholder='Search by name'
              prefix={<SearchOutlined />}
              className='max-w-sm'
            />
            <div className='flex items-center gap-3'>
              <span className='uppercase text-xs'>Status: </span>
              <Select
                placeholder='Status'
                options={statusOptions}
                value={statusFilter}
                onChange={handleStatusChange}
                className='min-w-[120px]'
              />
            </div>
          </div>
        </div>
      </Card>

      <Table
        {...tableProps}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
        rowKey={'id'}
      >
        <Table.Column
          dataIndex={'thumbnail'}
          title='Thumbnail'
          render={(value) => <Image src={value} height={32} width={32} />}
        />
        <Table.Column dataIndex={'name'} title='Name' />
        <Table.Column
          dataIndex={'price'}
          title='Price'
          sorter={{ multiple: 1 }}
          sortDirections={['ascend', 'descend']}
          render={(value) => formatVND(value)}
        />
        <Table.Column
          dataIndex={'status'}
          title='Status'
          render={(value: ProductStatus) => (
            <Tag
              color={
                value == 'active'
                  ? 'success'
                  : value == 'out of stock'
                  ? 'error'
                  : 'warning'
              }
              className='capitalize'
            >
              {value}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex={'purchases'}
          title='Purchases'
          sorter={{ multiple: 2 }}
          sortDirections={['ascend', 'descend']}
          render={(value) => formatNumberCount(value)}
        />
        <Table.Column
          dataIndex={'rating'}
          title='Rating'
          sorter={{ multiple: 3 }}
          sortDirections={['ascend', 'descend']}
          render={(value) => value.toFixed(2)}
        />
        <Table.Column
          render={(_, record) => (
            <Space>
              <EditButton hideText size='small' recordItemId={record.id} />
              <ShowButton hideText size='small' recordItemId={record.id} />
              <DeleteButton hideText size='small' recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </div>
  );
};
