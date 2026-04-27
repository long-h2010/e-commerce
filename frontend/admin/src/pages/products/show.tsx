import { ProductDetailTemplate } from '@/components/templates';
import { useHeaderStore } from '@/stores';
import { ProductDetail } from '@/types';
import { useGo, useParsed, useResourceParams, useShow } from '@refinedev/core';
import { Empty, Skeleton } from 'antd';
import { useEffect } from 'react';

export const ProductShow = () => {
  const { id } = useParsed();
  const { setState, clearState } = useHeaderStore();
  const go = useGo();
  const { resource } = useResourceParams();

  useEffect(() => {
    setState('Edit', 'edit', () =>
      go({
        to: {
          resource: resource?.name!,
          action: 'edit',
          id: id!,
        },
      }),
    );
    return () => clearState();
  }, []);

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

  if (isLoading) return <Skeleton />;

  if (!productData) return <Empty />;

  return <ProductDetailTemplate action='show' product={productData} />;
};
