'use client';

import { Menu, MenuProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

export const HeaderMenu = () => {
  const t = useTranslations('header');
  const [currentTab, setCurrentTab] = useState('home');

  const onSelectTab: MenuProps['onClick'] = useCallback(
    (e: any) => setCurrentTab(e.key),
    [],
  );

  const category = useMemo<Record<string, string>>(() => {
    const raw = t.raw('categories');
    return typeof raw === 'object' && raw !== null ? raw : {};
  }, [t]);

  const tabs = useMemo<MenuItem[]>(
    () =>
      Object.entries(category).map(([key, label]) => ({
        key,
        label: typeof label === 'string' ? label : key,
      })),
    [category],
  );

  const headerItems: MenuItem[] = useMemo(
    () => [
      {
        label: t('home'),
        key: 'home',
      },
      ...tabs,
    ],
    [tabs, t],
  );

  return (
    <Menu
      className='min-w-[320px]'
      mode='horizontal'
      selectedKeys={[currentTab]}
      onClick={onSelectTab}
      items={headerItems}
    />
  );
};
