import { Color } from './product';
import { User } from './user';

export type PaymentMethod = 'cod' | 'banking';

export type ShippingMethod = 'standard' | 'express';

export type PaymentStatus = 'paid' | 'unpaid' | 'refunded';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipping'
  | 'delivered'
  | 'cancelled';

export type ShippingAddress = {
  name?: string;
  phone?: string;
  address?: string;
  ward?: string;
  district?: string;
  city?: string;
};

export type OrderItem = {
  id: string;
  variant: {
    name: string;
    color: Color;
    size: string;
    thumbnail: string;
    sku: string;
  };
  priceAtTime: number;
  discountAmount: number;
  quantity: number;
  subtotal: number;
};

export type Order = ShippingAddress & {
  id: string;
  orderCode: number;
  items: OrderItem[];
  user?: User;
  notes?: string;
  shippingMethod?: ShippingMethod;
  shippingFee?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  orderStatus?: OrderStatus;
  discountAmount?: number;
  totalAmount?: number;
  createdAt?: string;
};

export type OrderOverview = {
  totalOrders: number;
  revenue: number;
  completeCount: number;
  cancelledCount: number;
};
