import { ResourceProps } from '@refinedev/core';
import { dashboardResource } from './dashboard';
import { usersResource } from './users';
import { productResource } from './product';
import { categoryResource } from './categories';

export const resources: ResourceProps[] = [
  dashboardResource,
  usersResource,
  categoryResource,
  productResource
];
