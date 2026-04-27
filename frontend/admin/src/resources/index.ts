import { ResourceProps } from '@refinedev/core';
import { dashboardResource } from './dashboard';
import { usersResource } from './users';
import { productResource } from './product';
import { categoryResource } from './categories';
import { colorResource } from './colors';
import { orderResource } from './orders';
import { discountResource } from './discount';

export const resources: ResourceProps[] = [
  dashboardResource,
  usersResource,
  categoryResource,
  colorResource,
  productResource,
  discountResource,
  orderResource
];
