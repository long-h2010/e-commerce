import { ColorSwatch } from '@/components/atoms';
import { formatVND } from '@/lib/utils';
import { usePermissions } from '@refinedev/core';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { memo } from 'react';

export const ProductInventory = memo(
  ({ tableProps }: { tableProps: TableProps }) => {
    const { data: role } = usePermissions({});

    return (
      <Table {...tableProps} rowKey={'id'}>
        <Table.Column
          title='Color'
          dataIndex={'color'}
          render={(value) => <ColorSwatch {...value} />}
        />
        <Table.Column
          title='Size'
          dataIndex={'size'}
          render={(value) => <Tag>{value}</Tag>}
        />
        <Table.Column title='Stock' dataIndex={'stock'} />
        {role == 'super admin' && (
          <Table.Column
            title='Cost'
            dataIndex={'cost'}
            render={(value) => formatVND(value)}
          />
        )}
        <Table.Column
          title='Price'
          dataIndex={'price'}
          render={(value) => formatVND(value)}
        />
      </Table>
    );
  },
);
