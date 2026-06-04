import { Color } from "./product";

export type PaymentMethod = 'cod' | 'banking';

export type ShippingMethod = 'standard' | 'express';

export type PaymentStatus = 'waiting' | 'success' | 'expired';

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
  shippingMethod?: ShippingMethod;
  shippingFee?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  orderStatus?: OrderStatus;
  discountAmount?: number;
  totalAmount?: number;
  createdAt?: string;
};
