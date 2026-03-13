import { create } from 'zustand';
import type { MenuItem, MenuCategory } from '@/types/menu';
import { menuApi } from '@/services/menu.api';
import { sampleMenuItems, sampleCategories } from '@/utils/sampleData';

interface MenuState {
  items: MenuItem[];
  categories: MenuCategory[];
  isLoading: boolean;

  fetchItems: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  upsertItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  items: [],
  categories: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const response = await menuApi.getAll();
      set({ items: response.data, isLoading: false });
    } catch {
      set({ items: sampleMenuItems, isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await menuApi.getCategories();
      set({ categories: response.data });
    } catch {
      set({ categories: sampleCategories });
    }
  },

  upsertItem: (item) => {
    set((state) => {
      const exists = state.items.some((i) => i.id === item.id);
      if (exists) {
        return { items: state.items.map((i) => (i.id === item.id ? item : i)) };
      }
      return { items: [...state.items, item] };
    });
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
  },
}));
