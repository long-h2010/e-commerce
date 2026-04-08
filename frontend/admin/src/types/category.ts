export const MainCategory = ['men', 'women', 'accessories'];

export type Category = {
  id: string;
  category: string;
  parentId: string;
}

export type CategorySummary = {
  id: string;
  category: string;
  totalProducts: number;
};
