import { create } from 'zustand';

interface CategoryStore {
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategoryId: '',
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
}));
