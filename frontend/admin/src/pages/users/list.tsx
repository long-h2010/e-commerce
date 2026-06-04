import { UserRoleTag, UserStatusBadge } from '@/components/atoms';
import { PageTemplate } from '@/components/templates';
import { formatDate, formatVND } from '@/lib/utils';
import { Order, User } from '@/types';
import { UnlockOutlined, LockOutlined } from '@ant-design/icons';
import {
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from '@refinedev/antd';
import { useUpdate } from '@refinedev/core';
import { Avatar, Badge, Button, Popconfirm, Space, Table, Tooltip } from 'antd';
import { useState } from 'react';

export const UserList = () => {
  const { tableProps } = useTable<User>({
    syncWithLocation: false,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { mutate: updateUser } = useUpdate();

  const toggleStatus = (user: User) => {
    updateUser({
      resource: import.meta.env.VITE_USERS_ENDPOINT,
      id: user.id,
      values: { isActive: !user.isActive },
    });
  };

  return (
    <PageTemplate>
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
          title='User'
          render={(_, record) => (
            <div className='flex gap-1 items-center'>
              <Avatar src={record.avatar}>{record.name[0]}</Avatar>
              <span>{record.name}</span>
            </div>
          )}
        />
        <Table.Column title='Userame' dataIndex={'username'} />
        <Table.Column title='email' dataIndex={'email'} ellipsis width={100} />
        <Table.Column title='Phone number' dataIndex={'phoneNumber'} />
        <Table.Column
          title='Role'
          dataIndex={'role'}
          render={(value) => <UserRoleTag role={value} />}
        />
        <Table.Column
          title='Status'
          dataIndex={'isActive'}
          render={(value) => <UserStatusBadge isActive={value} />}
        />
        <Table.Column
          title='Orders'
          dataIndex={'orders'}
          render={(value) => (
            <Badge
              count={value.length}
              showZero
              style={{
                backgroundColor: value === 0 ? '#e8e8e8' : '#1d1d1d',
                color: value === 0 ? '#999' : '#fff',
              }}
            />
          )}
        />
        <Table.Column
          title='Total Spent'
          dataIndex={'orders'}
          render={(value) =>
            formatVND(
              value
                .filter((v: Order) => v.paymentStatus == 'paid')
                .reduce((total: number, v: Order) => v.totalAmount! + total, 0),
            )
          }
        />
        <Table.Column
          title='Created At'
          dataIndex={'createdAt'}
          render={(value) => formatDate(value)}
        />
        <Table.Column
          align='center'
          render={(_, record: User) => (
            <Space>
              <Tooltip title={record.isActive == false ? 'Unban' : 'Ban'}>
                <Popconfirm
                  title={
                    record.isActive == false
                      ? 'Unban this user?'
                      : 'Ban this user?'
                  }
                  okText='Yes'
                  cancelText='No'
                  okButtonProps={{ danger: record.isActive !== false }}
                  onConfirm={() => toggleStatus(record)}
                >
                  <Button
                    size='small'
                    icon={
                      record.isActive == false ? (
                        <UnlockOutlined />
                      ) : (
                        <LockOutlined />
                      )
                    }
                    danger={record.isActive != false}
                  />
                </Popconfirm>
              </Tooltip>
            </Space>
          )}
        />
      </Table>
    </PageTemplate>
  );
};
