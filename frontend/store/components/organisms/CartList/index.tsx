import { CartItem } from '@/components/molecules';
import { ProductCart } from '@/types';
import { Empty } from 'antd';
import { useTranslations } from 'next-intl';
import { memo } from 'react';

export const CartList = memo(
  ({
    list,
    onChangleQuantity,
  }: {
    list: ProductCart[];
    onChangleQuantity: (id: string, price: number) => void;
  }) => {
    const t = useTranslations('cart');

    return (
      <div className='flex flex-col gap-5'>
        {list.length > 0 ? (
          list.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onChangleQuantity={onChangleQuantity}
            />
          ))
        ) : (
          <Empty description={t('empty')} />
        )}
      </div>
    );
  },
);
