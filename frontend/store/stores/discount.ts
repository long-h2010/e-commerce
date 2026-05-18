import { Discount } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DiscountState {
  discount: (Discount & { appliedAt: number }) | null;
  setDiscount: (discount: Discount) => void;
  clearDiscount: () => void;
  getValidDiscount: () => DiscountState['discount'];
}

const DISCOUNT_TTL = 1000 * 60 * 30;

export const useDiscountStore = create<DiscountState>()(
  persist(
    (set, get) => ({
      discount: null,

      setDiscount: (discount: Discount) =>
        set({
          discount: { ...discount, appliedAt: Date.now() },
        }),

      clearDiscount: () => set({ discount: null }),

      getValidDiscount: () => {
        const { discount } = get();
        if (!discount) return null;

        const isExpired = Date.now() - discount.appliedAt > DISCOUNT_TTL;
        if (isExpired) {
          set({ discount: null });
          return null;
        }

        return discount;
      },
    }),
    { name: 'discount-storage' },
  ),
);
