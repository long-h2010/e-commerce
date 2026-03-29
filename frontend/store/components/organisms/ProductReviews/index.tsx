import { ReviewCard, ReviewSummnary } from '@/components/molecules';
import { RatingSummary, Review } from '@/types';
import { DownCircleOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import { useTranslations } from 'next-intl';

export const ProductReviews = ({
  reviews,
  summary,
}: {
  reviews: Review[];
  summary: RatingSummary;
}) => {
  const t = useTranslations('product');
  
  return <div className='flex flex-col py-6 gap-8'>
    <Divider><span className='text-xl italic capitalize'>{t('customer_reviews')}</span></Divider>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-20'>
      <div className='flex flex-col md:order-2'>
        <ReviewSummnary summary={summary} />
      </div>
      <div className='flex flex-col gap-5 md:col-span-2 md:order-1'>
        {reviews ? reviews.map((r) => <ReviewCard key={r.id} review={r} />) : 'No content'}
        <Button icon={<DownCircleOutlined />} type='text'>{t('see_more')}</Button>
      </div>
    </div>
  </div>
};
