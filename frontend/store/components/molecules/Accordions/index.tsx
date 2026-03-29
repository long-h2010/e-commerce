'use client';

import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import type { CollapseProps } from 'antd';
import { useTranslations } from 'use-intl';

export const Accordions = ({
  description,
  material,
}: {
  description: string;
  material: string;
}) => {
  const t = useTranslations('product');

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: <span className='!text-bold capitalize'>{t('description')}</span>,
      children: description,
    },
    {
      key: '2',
      label: (
        <span className='!text-bold capitalize'>{t('material_and_care')}</span>
      ),
      children: material,
    },
    {
      key: '3',
      label: (
        <span className='!text-bold capitalize'>
          {t('shipping_and_returns.title')}
        </span>
      ),
      children: <div style={{ whiteSpace: 'pre-line' }}>{t('shipping_and_returns.conditions')}</div>,
    },
  ];
  return (
    <Collapse
      items={items}
      bordered={false}
      defaultActiveKey={['1']}
      expandIconPlacement='end'
      expandIcon={({ isActive }) =>
        isActive ? <PlusOutlined /> : <MinusOutlined />
      }
    />
  );
};
