'use client';

import { ProductCard } from '@/components/molecules';
import { MainTemplate } from '@/components/templates';
import { useList } from '@/hooks';
import { useCategoryStore } from '@/stores';
import { ProductBase } from '@/types';

export default function Products() {
  const { selectedCategoryId } = useCategoryStore();
  const { data } = useList({
    resource: process.env.NEXT_PUBLIC_PRODUCTS_ENDPOINT!,
    params: {
      filters: [
        { field: 'categoryId', operator: 'eq', value: selectedCategoryId },
      ],
    },
  });

  return (
    <MainTemplate sidebar>
      <div className='grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3 gap-10 px-8'>
        {data &&
          data.data.map((p: ProductBase) => (
            <div key={p.id} className='col-span-1'>
              <ProductCard product={p} />
            </div>
          ))}
      </div>
    </MainTemplate>
  );
}
