'use client';

import { useList } from '@/hooks';
import { buildTreeData } from '@/lib/utils';
import { useCategoryStore } from '@/stores';
import { BaseCategory } from '@/types';
import { Menu } from 'antd';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const Sidebar = () => {
  const category = useParams().category;
  const { data: categories } = useList({ resource: 'categories' });
  const { setSelectedCategoryId } = useCategoryStore();

  const navItems = useMemo(() => {
    if (!categories?.data) return [];

    const root = categories.data.find(
      (c: BaseCategory) => c.category === category,
    );
    if (!root) return [];

    const getAllDescendants = (parentId: string): BaseCategory[] => {
      const children = categories.data.filter(
        (c: BaseCategory) => c.parentId === parentId,
      );
      return [
        ...children,
        ...children.flatMap((c: BaseCategory) => getAllDescendants(c.id)),
      ];
    };

    const descendants = getAllDescendants(root.id);

    const tree = buildTreeData(descendants, (c) => ({
      key: c.id,
      label: c.category,
    }));

    return [
      {
        key: 'all',
        label: <p>All</p>,
      },
      ...tree,
    ];
  }, [categories, category]);

  return (
    <Menu
      mode='inline'
      items={navItems}
      style={{ width: 256 }}
      defaultSelectedKeys={['all']}
      onSelect={({ key }) => {
        setSelectedCategoryId(key === 'all' ? '' : key);
      }}
      className='h-screen capitalize'
    />
  );
};
