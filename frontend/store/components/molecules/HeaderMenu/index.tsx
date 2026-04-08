'use client';

import { Menu, MenuProps } from 'antd';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

export const HeaderMenu = () => {
  const t = useTranslations('header');
  const pathname = usePathname();

  const category = useMemo<Record<string, string>>(() => {
    const raw = t.raw('categories');
    return typeof raw === 'object' && raw !== null ? raw : {};
  }, [t]);

  const tabs = useMemo<MenuItem[]>(
    () =>
      Object.entries(category).map(([key, label]) => ({
        key: label.toLowerCase(),
        label:
          typeof label === 'string' ? (
            <Link
              href={`/products/category/${label.toLowerCase()}`}
              className='capitalize'
            >
              {label}
            </Link>
          ) : (
            key
          ),
      })),
    [category],
  );

  const headerItems: MenuItem[] = useMemo(
    () => [
      {
        label: (
          <Link href='/' className='capitalize'>
            {t('home')}
          </Link>
        ),
        key: 'home',
      },
      ...tabs,
    ],
    [tabs, t],
  );

  const selectedKey = useMemo(() => {
    if (pathname === '/') return 'home';

    const match = pathname.match(/\/products\/category\/([^/]+)/);
    return match ? match[1] : '';
  }, [pathname]);

  return (
    <Menu
      className='min-w-[320px]'
      mode='horizontal'
      selectedKeys={[selectedKey]}
      items={headerItems}
    />
  );
};
