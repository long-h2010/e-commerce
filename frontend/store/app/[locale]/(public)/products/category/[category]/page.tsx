'use client';

import { ProductCard } from '@/components/molecules';
import { MainTemplate } from '@/components/templates';
import { useList } from '@/hooks';
import { useCategoryStore } from '@/stores';
import { ProductBase } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Products() {
  const { category } = useParams<{ category: string }>();
  const { selectedCategoryId, setSelectedCategoryId } = useCategoryStore();
  const [products, setProducts] = useState<ProductBase[]>([]);

  useEffect(() => setSelectedCategoryId(''), [category]);

  const { data } = useList({
    resource: process.env.NEXT_PUBLIC_PRODUCTS_ENDPOINT!,
    params: {
      filters: [
        { field: 'categoryName', operator: 'eq', value: category },
        { field: 'categoryId', operator: 'eq', value: selectedCategoryId },
      ],
    },
  });

  useEffect(() => {
    if (data) {
      setProducts(
        data.data.map((p: ProductBase) => ({
          ...p,
          badge: p.saleValue
            ? 'Sale'
            : Date.now() - new Date(p.createdAt).getTime() <=
                30 * 24 * 60 * 60 * 1000
              ? 'New'
              : '',
        })),
      );
    }
  }, [data]);

  return (
    <MainTemplate sidebar>
      <div className='flex flex-wrap gap-10 px-8'>
        {products &&
          products.map((p: ProductBase) => (
            <div key={p.id} className='col-span-1'>
              <ProductCard product={p} />
            </div>
          ))}
      </div>
    </MainTemplate>
  );
}
