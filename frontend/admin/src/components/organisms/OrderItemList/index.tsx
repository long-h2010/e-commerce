import { Price } from '@/components/atoms';
import { OrderItemCard } from '@/components/molecules';
import { Order, OrderItem } from '@/types';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Divider } from 'antd';

export const OrderItemList = ({ order }: { order: Order }) => {
  const { items, shippingFee, discountAmount, totalAmount } = order;

  return (
    <Card>
      <div className='flex flex-col gap-5'>
        <div className='flex gap-1 items-center'>
          <ShoppingCartOutlined />
          <span className='font-semibold text-[16px]'>Order Items</span>
        </div>
        <div className='flex flex-col gap-3'>
          {items.map((item: OrderItem) => (
            <>
              <OrderItemCard key={item.id} item={item} />
              <Divider />
            </>
          ))}
        </div>
        <div className='flex justify-end'>
          <div className='min-w-sm'>
            <div className='flex justify-between'>
              <span>Subtotal</span>
              <Price price={totalAmount!} />
            </div>
            <div className='flex justify-between'>
              <span>Shipping Fee</span>
              <Price price={shippingFee!} />
            </div>
            <div className='flex justify-between'>
              <span>Discount Amount</span>
              <Price price={-discountAmount!} className='text-green-500' />
            </div>
            <Divider />
            <div className='flex justify-between'>
              <span className='font-semibold text-[16px]'>Total</span>
              <Price price={totalAmount!} className='text-[16px]' />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
