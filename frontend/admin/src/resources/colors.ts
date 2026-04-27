import { ResourceProps } from '@refinedev/core';
import { BgColorsOutlined, } from '@ant-design/icons';
import { ResourceName } from '@/lib/constants/resource-name';
import React from 'react';

export const colorResource: ResourceProps = {
  name: ResourceName.COLORS,
  list: `/${ResourceName.COLORS}`,
  create: `/${ResourceName.COLORS}/create`,
  edit: `/${ResourceName.COLORS}/edit/:id`,
  show: `/${ResourceName.COLORS}/show/:id`,
  meta: {
    label: ResourceName.COLORS,
    icon: React.createElement(BgColorsOutlined),
  },
};
