import { ResourceProps } from '@refinedev/core';
import { ShoppingOutlined } from '@ant-design/icons';
import { ResourceName } from '@/lib/constants/resource-name';
import React from 'react';

export const productResource: ResourceProps = {
  name: ResourceName.PRODUCTS,
  list: `/${ResourceName.PRODUCTS}`,
  create: `/${ResourceName.PRODUCTS}/create`,
  edit: `/${ResourceName.PRODUCTS}/edit/:id`,
  show: `/${ResourceName.PRODUCTS}/show/:id`,
  meta: {
    label: ResourceName.PRODUCTS,
    icon: React.createElement(ShoppingOutlined),
  },
};
