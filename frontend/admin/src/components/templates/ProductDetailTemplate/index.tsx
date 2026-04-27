import {
  OverViewStats,
  ProductImages,
  ProductActivityLog,
  ProductSettings,
  ProductHeader,
  ProductDetailTabs,
  ProductFooter,
} from '@/components/organisms';
import { buildTreeData } from '@/lib/utils';
import { ProductDetail } from '@/types';
import {
  ShoppingCartOutlined,
  EyeOutlined,
  EditOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useList } from '@refinedev/core';
import { useState, useEffect } from 'react';

export const ProductDetailTemplate = ({
  form,
  action,
  product,
}: {
  form?: any;
  action: 'create' | 'edit' | 'show';
  product?: ProductDetail;
}) => {
  const [categoiesOptions, setCategoriesOptions] = useState<any[]>([]);

  const { result: categoriesResult } = useList({
    resource: import.meta.env.VITE_CATEGORIES_ENDPOINT,
  });

  useEffect(() => {
    if (!categoriesResult?.data) return;
    setCategoriesOptions(
      buildTreeData(
        categoriesResult.data.map((item: any) => ({
          id: item.id,
          title: item.category,
          value: item.id,
          parentId: item.parentId,
          level: item.level,
        })),
      ),
    );
  }, [categoriesResult?.data]);

  const overview = [
    {
      title: 'Units Sold',
      value: `${product?.purchases}`,
      color: 'green',
      icon: <ShoppingCartOutlined />,
    },
    {
      title: 'Views',
      value: `${product?.views}`,
      color: 'blue',
      icon: <EyeOutlined />,
    },
    {
      title: 'Reviews',
      value: `${product?.totalReviews}`,
      color: 'red',
      icon: <EditOutlined />,
    },
    {
      title: 'Avg Rating',
      value: `${product?.avgRating.toFixed(2)}`,
      color: 'orange',
      icon: <StarOutlined />,
    },
  ];

  return (
    <div className='flex flex-col gap-10'>
      {action == 'show' && <OverViewStats stats={overview} />}
      <div className='grid grid-cols-1 md:grid-cols-3 flex gap-5'>
        <div className='col-span-1 flex flex-col gap-5'>
          <ProductImages form={form} action={action} images={product?.images} />

          <ProductSettings />
          {action !== 'create' && <ProductActivityLog />}
        </div>
        <div className='flex flex-col gap-5 col-span-2'>
          <ProductHeader
            action={action}
            categoriesOptions={categoiesOptions}
            {...{ ...product }}
          />
          <ProductDetailTabs action={action} {...{ ...product }} />
          {action !== 'show' && form && <ProductFooter form={form} />}
        </div>
      </div>
    </div>
  );
};
