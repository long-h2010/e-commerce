import { ProductDetailTemplate } from '@/components/templates';
import { ProductDetail } from '@/types';
import { useTable } from '@refinedev/antd';
import { useParsed, useShow } from '@refinedev/core';
import { Empty, Skeleton } from 'antd';

export const ProductShow = () => {
  const { id } = useParsed();
  const {
    result: productData,
    query: { isLoading },
  } = useShow<ProductDetail>({
    queryOptions: {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 100,
    },
  });

  const { tableProps: variantsProps } = useTable({
    resource: `${import.meta.env.VITE_PRODUCT_VARIANTS_ENDPOINT}/${id}`,
    syncWithLocation: false,
  });

  const { tableProps: reviewsProps } = useTable({
    resource: `${import.meta.env.VITE_PRODUCT_REVIEWS_ENDPOINT}/${id}`,
    syncWithLocation: false,
  });

  if (isLoading) return <Skeleton />;

  if (!productData) return <Empty />;

  return (
    <ProductDetailTemplate
      action='show'
      product={productData}
      variants={variantsProps}
      reviews={reviewsProps}
    />
  );
};
