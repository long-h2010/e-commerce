import { Order } from './order';

export type UserRole = 'super admin' | 'admin' | 'customer';

export type User = {
  id: string;
  name?: string;
  email?: string;
  phoneNumber: string;
  avatar?: string;
  role?: UserRole;
  isActive?: boolean;
  orders?: Order;
};

export type UserSignIn = {
  username: string;
  password: string;
};
