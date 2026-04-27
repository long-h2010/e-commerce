import { PageTemplate } from '@/components/templates';
import { buildTreeData, formatNumberCount, formatVND } from '@/lib/utils';
import { useHeaderStore } from '@/stores';
import { ProductBase, ProductStatus, ProductStatusEnum } from '@/types';
import { SearchOutlined } from '@ant-design/icons';
import {
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from '@refinedev/antd';
import { useCustom, useGo, useList, useResourceParams } from '@refinedev/core';
import {
  Card,
  Image,
  Input,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  TreeSelect,
} from 'antd';
import { useEffect, useState } from 'react';

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: ProductStatusEnum.ACTIVE },
  { label: 'Out of Stock', value: ProductStatusEnum.OUTSTOCK },
  { label: 'Draft', value: ProductStatusEnum.DRAFT },
];

export const ProductList = () => {
  const { setState, clearState } = useHeaderStore();
  const go = useGo();
  const { resource } = useResourceParams();
  const [categories, setCategories] = useState<any[]>([]);

  const { result: categoriesResult } = useList({
    resource: import.meta.env.VITE_CATEGORIES_ENDPOINT,
  });

  useEffect(() => {
    if (!categoriesResult?.data) return;

    setCategories([
      { title: 'All', value: '' },
      ...buildTreeData(
        categoriesResult.data.map((item: any) => ({
          id: item.id,
          title: item.category,
          value: item.id,
          parentId: item.parentId,
        })),
      ),
    ]);
  }, [categoriesResult?.data]);

  useEffect(() => {
    setState('Create', 'plus', () =>
      go({
        to: {
          resource: resource?.name!,
          action: 'create',
        },
      }),
    );
    return () => clearState();
  }, []);

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
    filters: {
      permanent: [],
    },
    syncWithLocation: false,
  });

  const handleSearch = (value: string) => {
    setFilters(
      [{ field: 'keyword', operator: 'contains', value: value }],
      'replace',
    );
  };

  const handleStatusChange = (value: ProductStatus | undefined) => {
    setStatusFilter(value);
    if (value)
      setFilters([{ field: 'status', operator: 'eq', value }], 'replace');
    else setFilters([], 'replace');
  };

  const handleCategoryChange = (value: string) => {
    if (value)
      setFilters([{ field: 'categoryId', operator: 'eq', value }], 'replace');
    else setFilters([], 'replace');
  };

  return (
    <PageTemplate overview={overview}>
      <Card>
        <div className='flex justify-between gap-10'>
          <Input
            placeholder='Search by name'
            prefix={<SearchOutlined />}
            className='max-w-sm'
            onChange={(e) => handleSearch(e.target.value)}
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
          <div className='flex items-center gap-3'>
            <span className='uppercase text-xs'>Category: </span>
            <TreeSelect
              placeholder='Category'
              treeData={categories}
              className='min-w-[250px] capitalize!'
              onChange={handleCategoryChange}
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
          dataIndex={'visible'}
          title='Visible'
          render={(value) => <Switch defaultChecked={value == 'public'} disabled />}
        />
        <Table.Column
          dataIndex={'purchases'}
          title='Purchases'
          sorter={{ multiple: 2 }}
          sortDirections={['ascend', 'descend']}
          render={(value) => formatNumberCount(value)}
        />
        <Table.Column
          dataIndex={'avgRating'}
          title='Avg rating'
          sorter={{ multiple: 3 }}
          sortDirections={['ascend', 'descend']}
          render={(value) => value.toFixed(2)}
        />
        <Table.Column
          align='center'
          render={(_, record) => (
            <Space>
              <EditButton hideText size='small' recordItemId={record.id} />
              <ShowButton hideText size='small' recordItemId={record.id} />
              <DeleteButton hideText size='small' recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </PageTemplate>
  );
};
