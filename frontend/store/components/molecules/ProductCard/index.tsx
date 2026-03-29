'use client';

import { memo } from 'react';
import { Price, SafeRibbon } from '@/components/atoms';
import { ProductBase } from '@/types';
import {
  HeartOutlined,
  ShoppingCartOutlined,
  StarFilled,
} from '@ant-design/icons';
import { Card, Image } from 'antd';
import { formatNumberCount } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export const ProductCard = memo(({ product }: { product: ProductBase }) => {
  const t = useTranslations('product');
  const router = useRouter();
  const { id, name, thumbnail, price, salePrice, status, purchases, rating } = product;

  return (
    <div>
      <SafeRibbon label={status}>
        <Card
          cover={<Image height={240} width={200} src={thumbnail} />}
          actions={[
            <HeartOutlined key='love' />,
            <ShoppingCartOutlined key='cart' />,
          ]}
        >
          <div onClick={() => router.push(`/products/${id}`)}>
            <div className='flex flex-col'>
              <p className='text-[13px] font-medium'>{name}</p>
              <div className='flex items-center text-[11px] text-gray-400 mt-0.5 mb-3'>
                <p className='mr-0.5'>{rating}</p>
                <StarFilled style={{ color: '#f4a261' }} />
                <span className='mx-1'>•</span>
                <p>{formatNumberCount(purchases) + ' ' + t('purchases')} </p>
              </div>
            </div>
            <Price price={price} oldPrice={salePrice} className='!text-[15px]' />
          </div>
        </Card>
      </SafeRibbon>
    </div>
  );
});
