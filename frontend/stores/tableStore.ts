import { create } from 'zustand';
import type { Table, UpdateTablePayload } from '@/types/tables';
import { tablesApi } from '@/services/tables.api';
import { sampleTables } from '@/utils/sampleData';

interface TableState {
  tables: Table[];
  selectedTable: Table | null;
  isLoading: boolean;

  fetchTables: () => Promise<void>;
  selectTable: (tableId: string | null) => void;
  updateTable: (tableId: string, payload: UpdateTablePayload) => Promise<void>;
  upsertTable: (table: Table) => void;
}

export const useTableStore = create<TableState>((set, get) => ({
  tables: [],
  selectedTable: null,
  isLoading: false,

  fetchTables: async () => {
    set({ isLoading: true });
    try {
      const response = await tablesApi.getAll();
      set({ tables: response.data, isLoading: false });
    } catch {
      // Fall back to sample data for development
      set({ tables: sampleTables, isLoading: false });
    }
  },

  selectTable: (tableId) => {
    const table = tableId ? get().tables.find((t) => t.id === tableId) ?? null : null;
    set({ selectedTable: table });
  },

  updateTable: async (tableId, payload) => {
    try {
      const response = await tablesApi.update(tableId, payload);
      set((state) => ({
        tables: state.tables.map((t) => (t.id === tableId ? response.data : t)),
      }));
    } catch {
      // Optimistic local update on failure
      set((state) => ({
        tables: state.tables.map((t) =>
          t.id === tableId ? { ...t, ...payload } : t,
        ),
      }));
    }
  },

  upsertTable: (table) => {
    set((state) => {
      const exists = state.tables.some((t) => t.id === table.id);
      if (exists) {
        return { tables: state.tables.map((t) => (t.id === table.id ? table : t)) };
      }
      return { tables: [...state.tables, table] };
    });
  },
}));
