import { ReviewSummnary } from '@/components/molecules';
import {
  ProductImages,
  ProductInfor,
  ProductReviews,
} from '@/components/organisms';
import { MainTemplate } from '@/components/templates';
import { Review } from '@/types';

export default function Product() {
  const product = {
    id: '62135',
    name: 'Black T-shirt',
    thumbnail: '/images/categories/men.png',
    colors: [
      { name: 'black', hex: '#000000' },
      { name: 'Pink', hex: '#FFC0CB' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: `Lorem ipsum dolor sit amet, vince adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
      nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    price: 10000,
    salePrice: 100000,
    rating: 4,
    purchases: 12365,
    stock: 10,
    totalReview: 120,
  };

  const ratingSummary = {
    id: '12313',
    average: 4.5,
    totalReview: 1230,
    distribution: {
      5: 80,
      4: 10,
      3: 5,
      2: 5,
      1: 0,
    },
  };

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

  const images = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=90',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=90',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=90',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&q=90',
  ];

  return (
    <MainTemplate>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-start py-6'>
        <div className='animate-fade-up'>
          <ProductImages images={images} />
        </div>
        <div className='animate-fade-up delay-2'>
          <ProductInfor product={product} />
        </div>
      </div>
      <div id='reviews'>
        <ProductReviews reviews={reviews} summary={ratingSummary} />
      </div>
    </MainTemplate>
  );
}
