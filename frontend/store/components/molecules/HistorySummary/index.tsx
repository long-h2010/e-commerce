import { formatDate, formatVND } from '@/lib/utils';
import { Order } from '@/types';
import { Skeleton } from 'antd';
import { useTranslations } from 'next-intl';

export const HistorySummary = ({
  isLoading,
  order,
}: {
  isLoading: boolean;
  order: Order;
}) => {
  const t = useTranslations('order');
  const {
    orderCode,
    paymentMethod,
    shippingMethod,
    shippingFee,
    discountAmount,
    totalAmount,
    createdAt,
  } = order;

  const rows = [
    {
      label: t('order_code'),
      value: `#${orderCode?.toString().toUpperCase()}`,
    },
    {
      label: t('order_date'),
      value: formatDate(createdAt!),
    },
    {
      label: t('payment_method.title'),
      value:
        paymentMethod === 'banking'
          ? t('payment_method.banking')
          : t('payment_method.cod'),
    },
    {
      label: t('shipping_method.title'),
      value: `${shippingMethod === 'standard' ? t('shipping_method.standard') : t('shipping_method.express')} · ${formatVND(shippingFee ?? 0)}`,
    },
    {
      label: t('discount_amount'),
      value: formatVND(discountAmount ?? 0)
    },
    {
      label: t('total'),
      value: (
        <span className='font-medium text-green-700'>
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
          className={`px-4 py-3 flex justify-between items-center text-sm ${
            i < rows.length - 1 ? 'border-b border-gray-100' : ''
          }`}
        >
          <span className='text-gray-500'>{row.label}</span>
          {isLoading ? (
            <Skeleton.Input size='small' active />
          ) : (
            <span className='font-medium'>{row.value}</span>
          )}
        </div>
      ))}
    </div>
  );
};
