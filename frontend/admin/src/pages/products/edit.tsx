import { ProductDetailTemplate } from '@/components/templates';
import { ProductDetail } from '@/types';
import { useForm, useTable } from '@refinedev/antd';
import { useParsed } from '@refinedev/core';
import { Empty, Form, Skeleton } from 'antd';

export const ProductEdit = () => {
  const { id } = useParsed();
  const {
    query,
    formProps,
  } = useForm<ProductDetail>({
    action: 'edit',
    queryOptions: {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 100,
      queryKey: ['products', 'detail', id],
    },
  });

  const productInit = formProps.initialValues as ProductDetail;

  const { tableProps: variantsProps } = useTable({
    resource: `${import.meta.env.VITE_PRODUCT_VARIANTS_ENDPOINT}/${id}`,
    syncWithLocation: false,
  });

  const { tableProps: reviewsProps } = useTable({
    resource: `${import.meta.env.VITE_PRODUCT_REVIEWS_ENDPOINT}/${id}`,
    syncWithLocation: false,
  });

  if (query?.isLoading) return <Skeleton />;

  if (!query?.data) return <Empty />;

  return (
    <Form {...formProps}>
      <ProductDetailTemplate
        action={'edit'}
        product={productInit}
        variants={variantsProps}
        reviews={reviewsProps}
      />
    </Form>
  );
};
