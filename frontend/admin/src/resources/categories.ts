import { ResourceProps } from '@refinedev/core';
import { UnorderedListOutlined } from '@ant-design/icons';
import { ResourceName } from '@/lib/constants/resource-name';
import React from 'react';

export const categoryResource: ResourceProps = {
  name: ResourceName.CATEGORIES,
  list: `/${ResourceName.CATEGORIES}`,
  create: `/${ResourceName.CATEGORIES}/create`,
  edit: `/${ResourceName.CATEGORIES}/edit/:id`,
  show: `/${ResourceName.CATEGORIES}/show/:id`,
  meta: {
    label: ResourceName.CATEGORIES,
    icon: React.createElement(UnorderedListOutlined),
  },
};
