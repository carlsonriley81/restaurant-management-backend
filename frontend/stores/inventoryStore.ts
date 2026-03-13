import { create } from 'zustand';
import type { InventoryItem, InventoryAlert } from '@/types/inventory';
import { inventoryApi } from '@/services/inventory.api';
import { sampleInventory } from '@/utils/sampleData';

interface InventoryState {
  items: InventoryItem[];
  alerts: InventoryAlert[];
  isLoading: boolean;

  fetchItems: () => Promise<void>;
  addAlert: (alert: InventoryAlert) => void;
  upsertItem: (item: InventoryItem) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  alerts: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const response = await inventoryApi.getAll();
      set({ items: response.data, isLoading: false });
    } catch {
      set({ items: sampleInventory, isLoading: false });
    }
  },

  addAlert: (alert) => {
    set((state) => ({ alerts: [...state.alerts, alert] }));
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
}));
