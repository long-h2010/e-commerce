import { ResourceProps } from '@refinedev/core';
import { TagsOutlined } from '@ant-design/icons';
import { ResourceName } from '@/lib/constants/resource-name';
import React from 'react';

export const discountResource: ResourceProps = {
  name: ResourceName.DISCOUNTS,
  list: `/${ResourceName.DISCOUNTS}`,
  create: `/${ResourceName.DISCOUNTS}/create`,
  edit: `/${ResourceName.DISCOUNTS}/edit/:id`,
  show: `/${ResourceName.DISCOUNTS}/show/:id`,
  meta: {
    label: ResourceName.DISCOUNTS,
    icon: React.createElement(TagsOutlined),
  },
};
