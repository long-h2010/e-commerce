'use client';

import {
  Banner,
  Categories,
  MarqueeStrip,
  NewsLetter,
  ProductList,
} from '@/components/organisms';
import { MainTemplate } from '@/components/templates';
import { useAuth } from '@/hooks';
import { Category, ProductBase } from '@/types';

export default function Home() {
  const { user } = useAuth();
  console.log(user);

  const categories: Category[] = [
    { id: '123123', category: 'men', totalProducts: 256 },
    { id: '464566', category: 'women', totalProducts: 256 },
    { id: '234673', category: 'accessories', totalProducts: 256 },
  ];

  const products: ProductBase[] = [
    {
      id: '12312',
      name: 'T-shirt Y2K',
      thumbnail: '/images/categories/men.png',
      price: 10000,
      badge: 'New',
      salePrice: 100000,
      rating: 2,
      purchases: 12365,
    },
    {
      id: '234234',
      name: 'T-shirt',
      thumbnail: '/images/categories/men.png',
      price: 10000,
      salePrice: 100000,
      rating: 2,
      purchases: 12365,
    },
    {
      id: '67233',
      name: 'T-shirt',
      thumbnail: '/images/categories/men.png',
      price: 10000,
      rating: 2,
      purchases: 12365,
    },
    {
      id: '23425',
      name: 'T-shirt',
      thumbnail: '/images/categories/men.png',
      price: 10000,
      rating: 2,
      purchases: 12365,
    },
    {
      id: '234',
      name: 'T-shirt',
      thumbnail: '/images/categories/men.png',
      price: 10000,
      salePrice: 100000,
      rating: 2,
      purchases: 12365,
    },
    {
      id: '62135',
      name: 'T-shirt',
      thumbnail: '/images/categories/men.png',
      price: 10000,
      rating: 2,
      purchases: 12365,
    },
    {
      id: '52423',
      name: 'T-shirt',
      thumbnail: '/images/categories/men.png',
      price: 10000,
      rating: 2,
      purchases: 12365,
    },
  ];

  return (
    <MainTemplate>
      <div className='-m-16'>
        <Banner />
        <MarqueeStrip />
      </div>
      <Categories categories={categories} />
      <ProductList title={true} products={products} />
      <NewsLetter />
    </MainTemplate>
  );
}
