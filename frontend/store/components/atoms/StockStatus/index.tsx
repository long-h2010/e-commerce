import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';

export const StockStatus = ({ stock }: { stock: number }) => {
  const t = useTranslations('cart');
  const inStock = stock > 0;

  return (
    <div>
      {inStock ? (
        <div className='flex items-center gap-2 !text-green-500'>
          <CheckCircleOutlined />
          <span className='text-xs font-semibold tracking-widest uppercase'>{t('stock_status.in_stock')}</span>
        </div>
      ) : (
        <div className='flex items-center gap-2 !text-red-500'>
          <CloseCircleOutlined />
          <span className='text-xs font-semibold tracking-widest uppercase'>{t('stock_status.out_of_stock')}</span>
        </div>
      )}
    </div>
  );
};
