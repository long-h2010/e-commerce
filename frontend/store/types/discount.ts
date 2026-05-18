export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum DiscountApplyType {
  PRODUCT = 'product',
  ORDER = 'order',
  SHIPPING = 'shipping',
}

export enum DiscountStatus {
  ACTIVE = 'active',
  SCHEDULED = 'scheduled',
  PAUSED = 'paused',
  ENDED = 'ended',
}

export type Discount = {
  id: string;
  name: string;
  code: string;
  type: DiscountType;
  value: number;
  applyTo: DiscountApplyType;
  minOrder: number;
  usageLimit: number;
  usagePerUser: number;
  usageCount: number;
  startTime: Date;
  endTime: Date;
};
