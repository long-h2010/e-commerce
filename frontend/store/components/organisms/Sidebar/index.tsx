'use client';

import { DressIcon, PantsIcon, ShirtIcon } from '@/components/atoms';
import { AppstoreOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

const NAV_CONFIG = {
  men: ['tops', 'bottoms'],
  women: ['tops', 'bottoms', 'dresses'],
} as const;

const ICON_MAP = {
  tops: <ShirtIcon className='!ml-10' />,
  bottoms: <PantsIcon className='!ml-10' />,
  dresses: <DressIcon className='!ml-10' />,
};

export const Sidebar = () => {
  const t = useTranslations('sidebar');
  const category = useParams().category as keyof typeof NAV_CONFIG;

  const navs = useMemo(() => {
    return (NAV_CONFIG[category] || []).map((key) => ({
      key,
      label: <p>{t(key)}</p>,
      icon: ICON_MAP[key],
      children: Object.values(t.raw(`${key}_items`)).map((item: any) => ({
        key: item,
        label: <p className='ml-10'>{item}</p>,
      })),
    }));
  }, [category, t]);

  const items: MenuItem[] = [
    {
      key: 'all',
      label: <p>{t('all_products')}</p>,
      icon: <AppstoreOutlined className='!ml-10' />,
    },
    ...navs,
  ];

  return (
    <Menu
      mode='inline'
      items={items}
      style={{ width: 256 }}
      defaultSelectedKeys={['all']}
      className='h-screen'
    />
  );
};
