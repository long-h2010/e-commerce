'use client';

import {
  ProductImages,
  ProductInfor,
  ProductReviews,
} from '@/components/organisms';
import { MainTemplate } from '@/components/templates';
import { useOne } from '@/hooks';
import { Review } from '@/types';
import { useParams } from 'next/navigation';

const reviews: Review[] = [
  {
    id: '4521231',
    user: {
      id: '12351345',
      name: 'Long',
      avatar: '',
    },
    rating: 5,
    content: 'good',
    createdAt: new Date('2026-02-28'),
  },
  {
    id: '85245',
    user: {
      id: '12351345',
      name: 'Long',
      avatar: '',
    },
    rating: 5,
    content:
      'Lorem ipsum dolor sit amet, vince adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    createdAt: new Date('2026-02-28'),
  },
  {
    id: '6372',
    user: {
      id: '12351345',
      name: 'Long',
      avatar: '',
    },
    rating: 5,
    content: 'good',
    createdAt: new Date('2026-02-28'),
  },
  {
    id: '48524',
    user: {
      id: '12351345',
      name: 'Long',
      avatar: '',
    },
    rating: 5,
    content: 'good',
    createdAt: new Date('2026-02-28'),
  },
];

const ratingSummary = {
  id: '12313',
  average: 4.5,
  totalReviews: 1230,
  distribution: {
    5: 80,
    4: 10,
    3: 5,
    2: 5,
    1: 0,
  },
};

export default function Product() {
  const { id } = useParams();

  const { data } = useOne({
    resource: process.env.NEXT_PUBLIC_PRODUCTS_ENDPOINT!,
    id: id as string,
  });

  return (
    <MainTemplate>
      {data && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-start py-6'>
          <div className='animate-fade-up'>
            <ProductImages images={data.data.images || []} />
          </div>
          <div className='animate-fade-up delay-2'>
            <ProductInfor product={data.data} />
          </div>
        </div>
      )}

      <div id='reviews'>
        <ProductReviews reviews={reviews} summary={ratingSummary} />
      </div>
    </MainTemplate>
  );
}
