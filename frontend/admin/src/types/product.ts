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
  status: ProductStatus;
  purchases: number;
  stock: number;
  rating: number;
};

type Color = {
  name: string;
  hex: string;
};

export type ProductImage = {
  id: string;
  url: string;
  isThumbnail: boolean;
}

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
  categories: string[];
  createdAt: Date;
};

export type ProductCart = {
  productId: string;
  name: string;
  thumbnail: string;
  color: string;
  size: string;
  price: number;
  salePrice?: number;
  quantity: number;
  stock: number;
};
