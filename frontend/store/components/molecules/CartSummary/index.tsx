import { Price } from '@/components/atoms';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Divider, Input } from 'antd';
import { useTranslations } from 'next-intl';

export const CartSummary = ({
  subtotal,
  count,
}: {
  subtotal: number;
  count: number;
}) => {
  const t = useTranslations('cart');

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
          <span>{t('discount')}</span>
          <Price price={subtotal} />
        </div>
        <div className='flex justify-between'>
          <span>{t('shipping_estimate')}</span>
          <Price price={0} />
        </div>
      </div>
      <Divider size='small' />
      <div className='flex flex-col gap-2'>
        <label className='text-md'>{t('discount')}</label>
        <div className='flex'>
          <Input className='!rounded-none' placeholder={t('enter_coupon')} />
          <Button type='primary' className='!rounded-none !p-5'>
            {t('apply')}
          </Button>
        </div>
      </div>
      <Divider size='small' />
      <Button
        type='primary'
        icon={<ArrowRightOutlined />}
        iconPlacement='end'
        className='!p-5'
      >
        {t('checkout')}
      </Button>
    </div>
  );
};
