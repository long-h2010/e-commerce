import { OrderStatusTag, PaymentMethodTag, PaymentStatusTag } from '@/components/atoms';
import { formatDate } from '@/lib/utils';
import { Order } from '@/types';
import { Card, Divider, Tag } from 'antd';

export const OrderInfor = ({ order }: { order: Order }) => {
  const { orderCode, createdAt, orderStatus, paymentMethod, paymentStatus } =
    order;

  return (
    <Card>
      <div className='flex flex-col gap-5'>
        <span className='font-semibold text-[16px]'>Order Infor</span>
        <Divider size='small' />
        <div className='flex flex-col gap-3'>
          <div className='flex justify-between'>
            <span>Order Code</span>
            <span>{orderCode}</span>
          </div>
          <div className='flex justify-between'>
            <span>Order Date</span>
            <span>{formatDate(createdAt!)}</span>
          </div>
          <div className='flex justify-between'>
            <span>Order Status</span>
            <OrderStatusTag value={orderStatus!} />
          </div>
        </div>
        <Divider size='small' />
        <div className='flex flex-col gap-3'>   
          <div className='flex justify-between'>
            <span>Payment Method</span>
            <PaymentMethodTag value={paymentMethod!} />
          </div>
          <div className='flex justify-between'>
            <span>Payment Status</span>
            <PaymentStatusTag value={paymentStatus!} />
          </div>
        </div>
      </div>
    </Card>
  );
};
