import { ResourceProps } from '@refinedev/core';
import { UserOutlined } from '@ant-design/icons';
import { ResourceName } from '@/lib/constants/resource-name';
import React from 'react';

export const usersResource: ResourceProps = {
  name: ResourceName.USERS,
  list: `/${ResourceName.USERS}`,
  create: `/${ResourceName.USERS}/create`,
  edit: `/${ResourceName.USERS}/edit/:id`,
  show: `/${ResourceName.USERS}/show/:id`,
  meta: {
    label: ResourceName.USERS,
    icon: React.createElement(UserOutlined),
  },
};
