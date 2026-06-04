import { formatVND } from '@/lib/utils';
import { Skeleton } from 'antd';
import { useTranslations } from 'next-intl';

interface OrderInfoCardProps {
  isLoading: boolean;
  orderId?: string;
  paymentMethod?: string;
  totalAmount?: number;
}

export const OrderInfoCard = ({
  isLoading,
  orderId,
  paymentMethod,
  totalAmount,
}: OrderInfoCardProps) => {
  const t = useTranslations('order_success');

  const rows = [
    {
      label: t('order_code'),
      value: isLoading ? (
        <Skeleton.Input size='small' active />
      ) : (
        `#${orderId?.slice(0, 8).toUpperCase()}`
      ),
    },
    {
      label: t('payment_method'),
      value: isLoading ? (
        <Skeleton.Input size='small' active />
      ) : paymentMethod === 'QR' ? (
        t('banking')
      ) : (
        t('cod')
      ),
    },
    {
      label: t('total'),
      value: isLoading ? (
        <Skeleton.Input size='small' active />
      ) : (
        <span className='text-base font-medium text-green-700'>
          {formatVND(totalAmount ?? 0)}
        </span>
      ),
    },
  ];

  return (
    <div className='w-full bg-white border border-gray-100 rounded-xl overflow-hidden'>
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`px-4 py-3 flex justify-between items-center ${
            i < rows.length - 1 ? 'border-b border-gray-100' : ''
          }`}
        >
          <span className='text-sm text-gray-500'>{row.label}</span>
          <span className='text-sm font-medium'>{row.value}</span>
        </div>
      ))}
    </div>
  );
};
