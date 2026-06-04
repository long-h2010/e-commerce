import { Price } from '@/components/atoms';
import { OrderItem } from '@/types';
import { Avatar, Tag } from 'antd';

export const OrderItemCard = ({ item }: { item: OrderItem }) => {
  const { variant, priceAtTime, discountAmount, quantity, subtotal } = item;
  return (
    <div className='flex items-center justify-between gap-3'>
      <div className='flex items-center gap-2'>
        <Avatar
          size={40}
          shape='square'
          style={{ background: '#f5f5f5', fontSize: 20, flexShrink: 0 }}
          src={variant.thumbnail}
        />
        <div className='flex flex-col gap-1'>
          <span>{variant.name}</span>
          <span>{variant.sku}</span>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <div>
          <Price price={priceAtTime} saleValue={discountAmount} />
          <span> × {quantity}</span>
        </div>
        <div className='flex'>
          <Tag>{variant.color.name}</Tag>
          <Tag>{variant.size}</Tag>
        </div>
      </div>
      <span>
        <Price price={subtotal} />
      </span>
    </div>
  );
};
