import { Price } from '@/components/atoms';
import { formatVND } from '@/lib/utils';
import { OrderItem } from '@/types';
import { Divider, Skeleton } from 'antd';

export const OrderItemList = ({
  isLoading,
  items,
}: {
  isLoading: boolean;
  items?: OrderItem[];
}) => {
  if (isLoading) {
    return (
      <div className='bg-white border border-gray-100 rounded-xl p-4'>
        <Skeleton active avatar paragraph={{ rows: 1 }} />
      </div>
    );
  }

  return (
    <div className='bg-white border border-gray-100 rounded-xl overflow-hidden'>
      {items?.map((item, i) => (
        <div
          key={item.id}
          className={`px-4 py-3 flex gap-3 items-center justify-between ${
            i < items.length - 1 ? 'border-b border-gray-100' : ''
          }`}
        >
          <div className='flex gap-4 items-center'>
            <img
              src={item.variant.thumbnail}
              alt={item.variant.name}
              className='w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-100'
            />
            <div className='flex-1 min-w-0 !justify-items-start items-center'>
              <p className='text-sm font-medium truncate'>
                {item.variant?.name} ×{item.quantity}
              </p>
              <div className='flex gap-3  items-center'>
                <div className='flex items-center'>
                  <p>{item.variant.color.name}</p>
                  <Divider orientation='vertical' />
                  <p>{item.variant.size}</p>
                </div>{' '}
                <p>·</p>
                <Price
                  price={item.priceAtTime}
                  saleValue={item.discountAmount}
                />
              </div>
            </div>
          </div>
          <span className='text-sm font-medium flex-shrink-0'>
            {formatVND(item.subtotal)}
          </span>
        </div>
      ))}
    </div>
  );
};
