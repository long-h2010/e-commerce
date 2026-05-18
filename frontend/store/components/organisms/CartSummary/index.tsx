'use client';

import { Price } from '@/components/atoms';
import { useOne } from '@/hooks';
import { calDiscount, formatVND } from '@/lib/utils';
import { useDiscountStore } from '@/stores';
import { Discount, DiscountApplyType, DiscountType } from '@/types';
import { ArrowRightOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const CartSummary = ({
  subtotal,
  count,
}: {
  subtotal: number;
  count: number;
}) => {
  const t = useTranslations('cart');
  const router = useRouter();
  const { setDiscount } = useDiscountStore();
  const [coupon, setCoupon] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const shippingFee = 50000;

  const {
    data: discount,
    isLoading,
    isError,
  } = useOne({
    resource: process.env.NEXT_PUBLIC_APPLY_DISCOUNTS_ENDPOINT!,
    id: appliedCoupon,
    enabled: !!appliedCoupon,
  });

  useEffect(() => {
    if (!discount) return;

    const data: Discount = discount.data;
    const dis = calDiscount({ discount: data, subtotal, shippingFee })
    
    setDiscountValue(dis);
    setDiscount(data);
  }, [discount]);

  return (
    <div className='flex flex-col shadow-lg rounded-lg p-5 gap-5'>
      <span className='capitalize text-xl font-semibold mb-6'>
        {t('cart_summary')}
      </span>
      <div className='flex flex-col gap-3 text-sm'>
        <div className='flex justify-between'>
          <span>{t('subtotal', { count })}</span>
          <Price price={subtotal} />
        </div>
        <div className='flex justify-between'>
          <span>
            {t('shipping_estimate')} <QuestionCircleOutlined />
          </span>
          <Price price={shippingFee} />
        </div>
        <div className='flex justify-between'>
          <span>{t('discount')}</span>
          <Price price={discountValue} />
        </div>
      </div>
      <Divider size='small' />
      <div className='flex justify-between'>
        <span>{t('total')}</span>
        <Price price={subtotal + shippingFee + discountValue} />
      </div>
      <div className='flex flex-col gap-2'>
        <label className='text-md'>{t('discount')}</label>
        <div className='flex'>
          <Input
            className='!rounded-none'
            placeholder={t('enter_coupon')}
            status={isError ? 'error' : ''}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <Button
            type='primary'
            className='!rounded-none !p-5'
            loading={isLoading}
            onClick={() => setAppliedCoupon(coupon)}
          >
            {t('apply')}
          </Button>
        </div>
        {isError && (
          <span className='text-[0.6rem] text-red-500 uppercase tracking-wide'>
            {t('discount_not_found')}
          </span>
        )}
        {discount && (
          <span className='text-[0.6rem] text-green-500 uppercase tracking-wide'>
            {t('discount_message', {
              value:
                discount.data.type == DiscountType.FIXED
                  ? formatVND(discount.data.value)
                  : `${discount.data.value} %`,
              type: discount.data.applyTo,
            })}
          </span>
        )}
      </div>
      <Divider size='small' />
      <Button
        type='primary'
        icon={<ArrowRightOutlined />}
        iconPlacement='end'
        disabled={count == 0}
        className='!p-5'
        onClick={() => router.push('/checkout')}
      >
        {t('checkout')}
      </Button>
    </div>
  );
};
