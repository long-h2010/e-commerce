'use client';

import { Price } from '@/components/atoms';
import { CartList } from '@/components/organisms';
import { calDiscount, calSalePrice, formatVND } from '@/lib/utils';
import { useDiscountStore } from '@/stores';
import { Discount, ProductCart } from '@/types';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Divider } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

export const OrderSummary = ({
  items,
  shippingFee,
  total,
  setDiscountId,
  handleChangeQuantity,
  handleDeleteItem,
  setTotal,
}: {
  items: ProductCart[];
  shippingFee: number;
  total: number;
  setDiscountId: (id: string | null) => void;
  handleChangeQuantity: (variantId: string, quantity: number) => void;
  handleDeleteItem: (id: string) => void;
  setTotal: (value: number) => void;
}) => {
  const t = useTranslations('order');
  const { getValidDiscount } = useDiscountStore();
  const [discount, setDiscount] = useState<Discount | null>(null);

  useEffect(() => {
    const discount = getValidDiscount();
    setDiscountId(discount?.id ?? null);
    setDiscount(discount);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item: ProductCart) =>
        total +
        calSalePrice({ price: item.price, saleValue: item.saleValue ?? 0 }) *
          item.quantity,
      0,
    );
  }, [items]);

  const discountValue = useMemo(() => {
    if (!discount) return 0;
    return calDiscount({ discount, subtotal, shippingFee });
  }, [subtotal]);

  useEffect(
    () => setTotal(subtotal + shippingFee + discountValue),
    [subtotal, shippingFee, discountValue],
  );

  return (
    <Card className='!bg-gray-100'>
      <div className='flex gap-2'>
        <ShoppingCartOutlined />
        <span className='font-semibold'>
          {t('title', { amount: items.length })}
        </span>
      </div>

      <CartList
        list={items}
        onChangeQuantity={handleChangeQuantity}
        onDelete={handleDeleteItem}
      />
      <Divider />
      <div className='flex flex-col'>
        <div className='flex justify-between'>
          <span className='font-semibold'>{t('subtotal')}</span>
          <span>{formatVND(subtotal ?? 0)}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-semibold'>{t('shipping_fee')}</span>
          <span>{formatVND(shippingFee)}</span>
        </div>
        <div className='flex justify-between'>
          <div className='flex'>
            <span className='font-semibold'>{t('discount')}</span>
            <span>: {discount?.code ?? ''}</span>
          </div>
          <span className='text-green-500'>
            {formatVND(discountValue ?? 0)}
          </span>
        </div>
      </div>
      <Divider />
      <div className='flex justify-between'>
        <span className='font-semibold'>{t('total')}</span>
        <Price price={total} />
      </div>
    </Card>
  );
};
