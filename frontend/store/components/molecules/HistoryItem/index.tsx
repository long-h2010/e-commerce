import { formatDate } from '@/lib/utils';
import { Order } from '@/types';
import { Card, Tag } from 'antd';
import { Price } from '@/components/atoms';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const STATUS_MAP = {
  pending: 'orange',
  confirmed: 'lime',
  shipping: 'blue',
  delivered: 'green',
  cancelled: 'red',
};

export const HistoryItem = ({ order }: { order: Order }) => {
  const t = useTranslations('order');
  const { id, orderCode, items, orderStatus, totalAmount, createdAt } = order;

  return (
    <Link href={`/orders/${id}`}>
      <Card className='!w-full'>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-5 justify-between items-center'>
            <span className='text-sm font-medium'>
              #{orderCode} - [{t('items', { amount: items.length })}]
            </span>
            <Tag
              variant='outlined'
              color={STATUS_MAP[orderStatus!]}
              className='capitalize w-[80px] !flex justify-center'
            >
              {orderStatus}
            </Tag>
          </div>
          <div className='flex justify-between'>
            <div className='flex gap-1 items-center text-[10px]'>
              <ClockCircleOutlined />
              <span>{formatDate(createdAt!)}</span>
            </div>
            <Price price={totalAmount!} />
          </div>
        </div>
      </Card>
    </Link>
  );
};
