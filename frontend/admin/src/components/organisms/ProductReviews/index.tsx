import { UserDisplay } from '@/components/molecules';
import { formatDate } from '@/lib/utils';
import { StarFilled } from '@ant-design/icons';
import { useTable } from '@refinedev/antd';
import { Table } from 'antd';
import { memo } from 'react';
import { useParams } from 'react-router';

export const ProductReviews = memo(() => {
  const { id: productId } = useParams();

  const { tableProps } = useTable({
    resource: `${import.meta.env.VITE_PRODUCT_REVIEWS_ENDPOINT}`,
    syncWithLocation: false,
    filters: {
      permanent: [
        {
          field: 'productId',
          operator: 'eq',
          value: productId,
        },
      ],
    },
  });

  return (
    <Table {...tableProps}>
      <Table.Column
        title='Author'
        dataIndex={'user'}
        render={(value) => <UserDisplay {...value} />}
      />
      <Table.Column
        title='Rating'
        dataIndex={'rating'}
        render={(value) => (
          <div className='flex gap-1 items-center'>
            <span>{value}</span>
            <StarFilled style={{ color: 'orange' }} />
          </div>
        )}
      />
      <Table.Column title='Comment' dataIndex={'comment'} />
      <Table.Column
        title='Date'
        dataIndex={'createAt'}
        render={(value) => formatDate(value)}
      />
    </Table>
  );
});
