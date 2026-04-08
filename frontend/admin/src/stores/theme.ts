import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  mode: Theme;
  setMode: (theme: Theme) => void;
  toggleMode: () => void;
}

export const themeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',

      setMode: (mode) => set({ mode }),

      toggleMode: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'theme-storage',
    },
  ),
);
