export type ProductBase = {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
  salePrice?: number;
  status?: 'New' | 'Sale';
  purchases: number;
  rating: number;
};

type Color = {
  name: string;
  hex: string;
}

export type ProductDetail = ProductBase & {
  description: string;
  images?: string[];
  colors: Color[];
  sizes: string[]
  stock: number;
  totalReview: number;
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
}
