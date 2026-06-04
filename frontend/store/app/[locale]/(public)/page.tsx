'use client';

import {
  Banner,
  Categories,
  MarqueeStrip,
  NewsLetter,
  ProductList,
} from '@/components/organisms';
import { MainTemplate } from '@/components/templates';
import { useList } from '@/hooks';
import { CategorySummary, ProductBase } from '@/types';
import { useEffect, useState } from 'react';

export default function Home() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [products, setProducts] = useState<ProductBase[]>([]);
  const { data: categoriesData } = useList({
    resource: process.env.NEXT_PUBLIC_CATEGORIES_ENDPOINT!,
  });
  const { data: productsData } = useList({
    resource: process.env.NEXT_PUBLIC_PRODUCTS_ENDPOINT!,
  });

  useEffect(
    () =>
      setCategories(
        categoriesData?.data.filter((cat: any) => cat.level === 'root') || [],
      ),
    [categoriesData],
  );

  useEffect(() => {
    setProducts(productsData?.data || []);
  }, [productsData]);

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
