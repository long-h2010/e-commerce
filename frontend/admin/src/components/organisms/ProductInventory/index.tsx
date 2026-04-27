import { ColorSwatch } from '@/components/atoms';
import { formatVND } from '@/lib/utils';
import { ProductVariant } from '@/types';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { usePermissions, useUpdate } from '@refinedev/core';
import { Button, Input, InputNumber, Space, Table, Tag } from 'antd';
import { memo, useState } from 'react';
import { AddVariantDrawer } from '..';
import { DeleteButton, useTable } from '@refinedev/antd';
import { useParams } from 'react-router';

export const ProductInventory = memo(
  ({ action }: { action: 'create' | 'edit' | 'show' }) => {
    const { id } = useParams();
    const { data: role } = usePermissions({});
    const [openAddVariant, setOpenAddVariant] = useState<boolean>(false);
    const [editing, setEditing] = useState<ProductVariant | null>(null);

    const { mutate: updateVariant } = useUpdate();

    const { tableProps } = useTable({
      resource: `${import.meta.env.VITE_PRODUCT_VARIANTS_ENDPOINT}`,
      syncWithLocation: false,
      filters: {
        permanent: [
          {
            field: 'productId',
            operator: 'eq',
            value: id,
          },
        ],
      },
    });

    const handleUpdateVariant = () => {
      if (!editing) return;

      updateVariant(
        {
          resource: import.meta.env.VITE_PRODUCT_VARIANTS_ENDPOINT,
          values: editing,
          id: editing?.id,
        },
        {
          onSuccess: () => setEditing(null),
        },
      );
    };

    return (
      <div className='flex flex-col gap-4'>
        {action !== 'show' && (
          <>
            <div className='flex justify-between items-center'>
              <span className='text-gray-500'>
                Manage stock per color × size combination
              </span>
              <Button
                type='dashed'
                icon={<PlusOutlined />}
                onClick={() => setOpenAddVariant(true)}
              >
                Add variant
              </Button>
            </div>
            <AddVariantDrawer
              {...{
                open: openAddVariant,
                setOpen: setOpenAddVariant,
              }}
            />
          </>
        )}

        <Table {...tableProps} rowKey={'id'}>
          <Table.Column
            title='Color'
            dataIndex={'color'}
            render={(value) => <ColorSwatch {...value} />}
          />
          <Table.Column
            title='Size'
            dataIndex={'size'}
            sorter={{ multiple: 4 }}
            sortDirections={['ascend', 'descend']}
            render={(value) => <Tag>{value}</Tag>}
          />
          <Table.Column
            title='Sku'
            dataIndex={'sku'}
            sorter={{ multiple: 1 }}
            sortDirections={['ascend', 'descend']}
            render={(value, record) =>
              editing?.id !== record.id ? (
                value
              ) : (
                <Input
                  defaultValue={value}
                  onChange={(e) =>
                    setEditing((prev) => ({
                      ...prev!,
                      sku: e.target.value,
                    }))
                  }
                />
              )
            }
          />
          {role == 'super admin' && (
            <Table.Column
              title='Cost'
              dataIndex={'cost'}
              sorter={{ multiple: 2 }}
              sortDirections={['ascend', 'descend']}
              render={(value, record) =>
                editing?.id !== record.id ? (
                  formatVND(value)
                ) : (
                  <InputNumber<number>
                    defaultValue={value}
                    formatter={(value: any) => formatVND(value)}
                    parser={(value: any) => {
                      if (!value) return;
                      return value.replace(/[^0-9]/g, '');
                    }}
                    step={100000}
                    onChange={(num) =>
                      setEditing((prev) => ({
                        ...prev!,
                        cost: num || value,
                      }))
                    }
                  />
                )
              }
            />
          )}
          <Table.Column
            title='Price'
            dataIndex={'price'}
            sorter={{ multiple: 3 }}
            sortDirections={['ascend', 'descend']}
            render={(value, record) =>
              editing?.id !== record.id ? (
                formatVND(value)
              ) : (
                <InputNumber<number>
                  defaultValue={value}
                  formatter={(value: any) => formatVND(value)}
                  parser={(value: any) => {
                    if (!value) return;
                    return value.replace(/[^0-9]/g, '');
                  }}
                  step={100000}
                  onChange={(num) =>
                    setEditing((prev) => ({
                      ...prev!,
                      price: num || value,
                    }))
                  }
                />
              )
            }
          />
          <Table.Column
            title='Stock'
            dataIndex={'stock'}
            sorter={{ multiple: 1 }}
            sortDirections={['ascend', 'descend']}
            render={(value, record) => (
              <InputNumber
                defaultValue={value}
                disabled={editing?.id !== record.id}
                onChange={(num) =>
                  setEditing((prev) => ({
                    ...prev!,
                    stock: num || value,
                  }))
                }
              />
            )}
          />
          {action != 'show' && (
            <Table.Column
              align='center'
              render={(_, record) =>
                editing?.id == record.id ? (
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
                      onClick={handleUpdateVariant}
                    />
                  </Space>
                ) : (
                  <Space>
                    <Button
                      size='small'
                      icon={<EditOutlined />}
                      onClick={() => setEditing(record as ProductVariant)}
                    />
                    <DeleteButton
                      hideText
                      size='small'
                      recordItemId={record.id}
                      resource={import.meta.env.VITE_PRODUCT_VARIANTS_ENDPOINT}
                    />
                  </Space>
                )
              }
            />
          )}
        </Table>
      </div>
    );
  },
);
