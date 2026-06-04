export type ProductBase = {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
  saleValue?: number;
  badge?: 'New' | 'Sale';
  purchases: number;
  avgRating: number;
  createdAt: string;
};

export type Color = {
  name: string;
  hex: string;
}

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
  images?: ProductImage[];
  colors: Color[];
  sizes: string[]
  totalReviews: number;
};

export type ProductCart = {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  thumbnail: string;
  color: Color;
  size: string;
  price: number;
  saleValue?: number;
  quantity: number;
  stock: number;
}
