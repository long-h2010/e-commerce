import { Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import { ShippingAddress } from '@/types';

export const OrderShippingAddress = ({
  isLoading,
  orderShippingAddress,
}: {
  isLoading: boolean;
  orderShippingAddress: ShippingAddress;
}) => {
  const t = useTranslations('order');
  const { name, phone, address, ward, district, city } = orderShippingAddress;

  return (
    <div className='w-full bg-gray-50 rounded-xl px-4 py-3 flex gap-3 items-start'>
      <i
        className='ti ti-map-pin text-gray-400 mt-0.5'
        style={{ fontSize: 18 }}
        aria-hidden='true'
      />
      <div>
        <p className='text-sm text-black font-medium mb-0.5'>
          {t('shipping_to')}{' '}
          <span className='text-sm text-gray-500'>
            {name} · {phone}
          </span>
        </p>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 1 }} title={false} />
        ) : (
          <p className='text-sm text-gray-500 leading-relaxed'>
            <br />
            {address}, {ward}, {district}, {city}
          </p>
        )}
      </div>
    </div>
  );
};
