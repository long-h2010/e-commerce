import { ResourceProps } from '@refinedev/core';
import { FileDoneOutlined } from '@ant-design/icons';
import { ResourceName } from '@/lib/constants/resource-name';
import React from 'react';

export const orderResource: ResourceProps = {
  name: ResourceName.ORDERS,
  list: `/${ResourceName.ORDERS}`,
  create: `/${ResourceName.ORDERS}/create`,
  edit: `/${ResourceName.ORDERS}/edit/:id`,
  show: `/${ResourceName.ORDERS}/show/:id`,
  meta: {
    label: ResourceName.ORDERS,
    icon: React.createElement(FileDoneOutlined),
  },
};
