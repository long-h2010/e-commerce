import { OrderStatus } from '@/types';
import { Tag } from 'antd';

const ORDER_STATUS_MAP: Record<OrderStatus, string> = {
  pending: 'gold',
  confirmed: 'green',
  shipping: 'cyan',
  delivered: 'lime',
  cancelled: 'red',
};

export const OrderStatusTag = ({ value }: { value: OrderStatus }) => {
  return (
    <Tag className='capitalize' color={ORDER_STATUS_MAP[value]}>
      {value}
    </Tag>
  );
};
