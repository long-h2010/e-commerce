import { CartItem } from '@/components/molecules';
import { ProductCart } from '@/types';
import { Empty } from 'antd';
import { useTranslations } from 'next-intl';
import { memo } from 'react';

export const CartList = memo(
  ({
    list,
    onChangeQuantity,
    onDelete,
  }: {
    list: ProductCart[];
    onChangeQuantity: (id: string, price: number) => void;
    onDelete: (id: string) => void;
  }) => {
    const t = useTranslations('cart');

    return (
      <div className='flex flex-col gap-5'>
        {list.length > 0 ? (
          list.map((item) => (
            <CartItem
              key={item.variantId}
              item={item}
              onChangeQuantity={onChangeQuantity}
              onDelete={onDelete}
            />
          ))
        ) : (
          <Empty description={t('empty')} />
        )}
      </div>
    );
  },
);
