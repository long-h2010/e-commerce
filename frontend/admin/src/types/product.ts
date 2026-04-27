import { BaseCategory } from './category';

export type ProductStatus = 'active' | 'out of stock' | 'draft';

export enum ProductStatusEnum {
  ACTIVE = 'active',
  OUTSTOCK = 'out of stock',
  DRAFT = 'draft',
}

export type ProductBase = {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
  saleValue: number;
  status: ProductStatus;
  purchases: number;
  stock: number;
  avgRating: number;
};

export type Color = {
  id: string;
  name: string;
  hex: string;
};

export type ProductImage = {
  id: string;
  url: string;
  isThumbnail: boolean;
};

export type ProductVariant = {
  id: string;
  color: Color;
  size: string;
  cost: number;
  price: number;
  stock: number;
};

export type ProductDetail = ProductBase & {
  description: string;
  materials: string;
  care: string;
  images?: ProductImage[];
  colors: Color[];
  sizes: string[];
  stock: number;
  views: number;
  totalReviews: number;
  categories: BaseCategory[];
  createdAt: Date;
};
