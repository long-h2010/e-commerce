import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HeaderState {
  title: string | null;
  icon: 'plus' | 'save' | 'edit' | null;
  onClick: (value?: any) => void;
  setState: (title: string, icon: 'plus' | 'save' | 'edit', onClick: (value?: any) => void) => void;
  clearState: () => void;
}

export const useHeaderStore = create<HeaderState>()(
  persist(
    (set) => ({
      title: null,
      icon: null,
      onClick: () => {},

      setState: (title, icon, onClick) =>
        set(() => ({
          title,
          icon,
          onClick,
        })),

      clearState: () =>
        set({
          title: null,
          icon: null,
          onClick: () => {},
        }),
    }),
    {
      name: 'header-storage',
    },
  ),
);
