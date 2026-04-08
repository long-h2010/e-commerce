import { ResourceProps } from '@refinedev/core';
import { AppstoreOutlined } from '@ant-design/icons';
import { ResourceName } from '@/lib/constants/resource-name';
import React from 'react';

export const dashboardResource: ResourceProps = {
  name: ResourceName.DASHBOARD,
  list: '/',
  meta: {
    label: ResourceName.DASHBOARD,
    icon: React.createElement(AppstoreOutlined),
  },
};
