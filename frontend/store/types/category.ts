export const MainCategory = ['men', 'women', 'accessories'];

export enum CategoryLevel {
  ROOT = 'root',
  CHILD = 'child',
  LEAF = 'leaf',
}

export type BaseCategory = {
  id: string;
  category: string;
  slug: string;
  level: CategoryLevel;
  parentId: string;
};

export type Category = BaseCategory & {
  productCount: number;
  createdAt: string;
  children?: Category[];
};

export type CategorySummary = {
  id: string;
  category: string;
  productCount: number;
};
