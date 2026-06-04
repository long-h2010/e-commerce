import { CategoryPath } from '@/components/molecules';
import { AddCategoryDrawer } from '@/components/organisms';
import { PageTemplate } from '@/components/templates';
import { buildTreeData, formatDate } from '@/lib/utils';
import { useHeaderStore } from '@/stores';
import { Category, CategoryLevel } from '@/types/category';
import { CloseOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons';
import { DeleteButton, useTable } from '@refinedev/antd';
import { useUpdate } from '@refinedev/core';
import { Button, Input, Space, Table, Tag, TreeSelect } from 'antd';
import { useEffect, useState } from 'react';

export const CategoryList = () => {
  const { setState } = useHeaderStore();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [categoriesTree, setCategoriesTree] = useState<Category[]>([]);
  const [optionsTree, setOptionsTree] = useState<any[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [openAddCategory, setOpenAddCategory] = useState<boolean>(false);
  const { mutate: updateCategory } = useUpdate();

  const { tableProps } = useTable({
    syncWithLocation: false,
  });

  useEffect(() => {
    const data: any = tableProps?.dataSource;
    if (data) {
      setCategoriesTree(buildTreeData(data) || []);
      setOptionsTree(
        buildTreeData(
          data
            .filter((item: any) => item.level !== CategoryLevel.LEAF)
            .map((item: any) => ({
              id: item.id,
              title: item.category,
              value: item.id,
              parentId: item.parentId,
            })),
        ),
      );
    }
  }, [tableProps?.dataSource]);

  const handleUpdateCategory = () => {
    if (!editing) return;

    updateCategory(
      {
        resource: import.meta.env.VITE_CATEGORIES_ENDPOINT,
        id: editing.id,
        values: editing,
      },
      {
        onSuccess: () => {
          setEditing(null);
        },
      },
    );
  };

  useEffect(() => {
    setState('Create', 'plus', () => setOpenAddCategory(true));
  }, []);

  return (
    <PageTemplate>
      <Table
        {...tableProps}
        dataSource={categoriesTree}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        expandable={{ defaultExpandAllRows: true }}
        rowKey='id'
        className='capitalize'
      >
        <Table.Column
          title='Category'
          dataIndex={'category'}
          render={(value, record) => {
            if (editing?.id === record.id)
              return (
                <Input
                  defaultValue={value}
                  size='small'
                  className='max-w-[200px]'
                  onChange={(e) =>
                    setEditing((s) =>
                      s ? { ...s, category: e.target.value } : s,
                    )
                  }
                />
              );
            return <span className=''>{value}</span>;
          }}
        />
        <Table.Column
          title='Path'
          render={(_, record) => {
            if (editing?.id === record.id) {
              return (
                <TreeSelect
                  className='capitalize'
                  size='small'
                  style={{ width: 200 }}
                  treeData={optionsTree}
                  defaultValue={editing?.category}
                  onChange={(v) =>
                    setEditing((s) => (s ? { ...s, parentId: v ?? null } : s))
                  }
                  treeDefaultExpandAll
                />
              );
            }
            return (
              <CategoryPath
                item={record as any}
                all={tableProps.dataSource as any}
              />
            );
          }}
        />
        <Table.Column
          title='Slug'
          dataIndex={'slug'}
          render={(value, record) => {
            if (editing?.id === record.id) {
              return (
                <Input
                  defaultValue={value}
                  className='font-mono text-xs lowercase'
                  onChange={(e) =>
                    setEditing((s) => (s ? { ...s, slug: e.target.value } : s))
                  }
                />
              );
            }
            return <span className='font-mono text-xs lowercase'>{value}</span>;
          }}
        />
        <Table.Column
          title='Products'
          dataIndex='productCount'
          render={(value) => <Tag>{value}</Tag>}
        />
        <Table.Column
          title='Created'
          dataIndex='createdAt'
          sorter={{ multiple: 1 }}
          sortDirections={['ascend', 'descend']}
          render={(value: string) => formatDate(value)}
        />
        <Table.Column
          align='center'
          render={(_, record: Category) => {
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
                    onClick={() => handleUpdateCategory()}
                  />
                </Space>
              );
            } else
              return (
                <Space>
                  <Button
                    size='small'
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditing(record);
                    }}
                  />
                  <DeleteButton
                    hideText
                    size='small'
                    recordItemId={record.id}
                  />
                </Space>
              );
          }}
        />
      </Table>
      <AddCategoryDrawer
        open={openAddCategory}
        setOpen={setOpenAddCategory}
        parentCategoriesOptions={optionsTree}
      />
    </PageTemplate>
  );
};
