import {
  OverViewStats,
  ProductImages,
  ProductActivityLog,
  ProductSettings,
  ProductHeader,
  ProductDetailTabs,
} from '@/components/organisms';
import { ProductDetail } from '@/types';
import {
  ShoppingCartOutlined,
  EyeOutlined,
  EditOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Skeleton } from 'antd';

export const ProductDetailTemplate = ({
  action,
  product,
  variants,
  reviews,
}: {
  action: 'edit' | 'show'
  product: ProductDetail;
  variants: any;
  reviews: any;
}) => {
  const overview = [
    {
      title: 'Units Sold',
      value: `${product.purchases}`,
      color: 'green',
      icon: <ShoppingCartOutlined />,
    },
    {
      title: 'Views',
      value: `${product.views}`,
      color: 'blue',
      icon: <EyeOutlined />,
    },
    {
      title: 'Reviews',
      value: `${product.totalReviews}`,
      color: 'red',
      icon: <EditOutlined />,
    },
    {
      title: 'Avg Rating',
      value: `${product.rating.toFixed(2)}`,
      color: 'orange',
      icon: <StarOutlined />,
    },
  ];

  return (
    <div className='flex flex-col gap-10'>
      {action == 'show' && <OverViewStats stats={overview} />}
      <div className='grid grid-cols-1 md:grid-cols-3 flex gap-5'>
        <div className='col-span-1 flex flex-col gap-5'>
          {product.images ? (
            <ProductImages images={product.images} action={action} />
          ) : (
            <Skeleton.Image active />
          )}

          <ProductSettings />
          <ProductActivityLog />
        </div>
        <div className='flex flex-col gap-5 col-span-2'>
          <ProductHeader action={action} {...{ ...product }} />
          <ProductDetailTabs {...{ ...product }} variants={variants} reviews={reviews} />
        </div>
      </div>
    </div>
  );
};
