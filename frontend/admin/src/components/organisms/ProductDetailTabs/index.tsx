import { Card, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { ProductInfor } from '../ProductInfor';
import { ProductInventory } from '../ProductInventory';
import { InboxOutlined, StarFilled } from '@ant-design/icons';
import { ProductReviews } from '../ProductReviews';
import { memo } from 'react';
import { Color } from '@/types';

export const ProductDetailTabs = memo(
  ({
    action,
    description,
    materials,
    care,
    colors,
    sizes,
  }: {
    action: 'create' | 'edit' | 'show';
    description?: string;
    materials?: string;
    care?: string;
    colors?: Color[];
    sizes?: string[];
  }) => {
    const tabsItems: TabsProps['items'] = [
      {
        key: 'detail',
        label: 'Detail',
        children: (
          <ProductInfor
            action={action}
            {...{ description, materials, care, colors, sizes }}
          />
        ),
      },
    ];

    if (action !== 'create')
      tabsItems.push(
        {
          key: 'inventory',
          label: (
            <>
              <InboxOutlined />
              <span>Inventory</span>
            </>
          ),
          children: <ProductInventory action={action} />,
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
          children: <ProductReviews />,
        },
      );

    return (
      <Card>
        <Tabs items={tabsItems} />
      </Card>
    );
  },
);
