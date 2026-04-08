import { Card, Table, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { ProductInfor } from '../ProductInfor';
import { ProductInventory } from '../ProductInventory';
import { InboxOutlined, StarFilled } from '@ant-design/icons';
import { ProductReviews } from '../ProductReviews';

export const ProductDetailTabs = ({
  description,
  materials,
  care,
  variants,
  reviews,
}: {
  description: string;
  materials: string;
  care: string;
  variants: any;
  reviews: any;
}) => {
  const colors = variants.dataSource?.map((v: any) => v.color);
  const sizes = [...new Set(variants.dataSource?.map((v: any) => v.size))];

  const tabsItems: TabsProps['items'] = [
    {
      key: 'detail',
      label: 'Detail',
      children: (
        <ProductInfor {...{ description, materials, care, colors, sizes }} />
      ),
    },
    {
      key: 'inventory',
      label: (
        <>
          <InboxOutlined />
          <span>Inventory</span>
        </>
      ),
      children: <ProductInventory tableProps={variants} />,
    },
    {
      key: 'pricing',
      label: 'Pricing',
      children: <></>,
    },
    {
      key: 'review',
      label: (
        <>
          <StarFilled style={{ color: 'orange' }} />
          <span>Reviews</span>
        </>
      ),
      children: <ProductReviews tableProps={reviews} />,
    },
  ];

  return (
    <Card>
      <Tabs items={tabsItems} />
    </Card>
  );
};
