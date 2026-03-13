import { create } from 'zustand';
import type {
  KitchenTicket,
  KitchenOrderStatus,
  KitchenSettings,
  QueuedKitchenAction,
  KitchenActionType,
} from '@/types/kitchen';
import { getItem, setItem, STORAGE_KEYS } from '@/utils/storage';

// ─── Default settings ──────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: KitchenSettings = {
  stationFilter: 'all',
  chefFilter: '',
  orderTypeFilter: 'all',
  priorityFilter: 'all',
  soundEnabled: true,
  soundNewOrder: true,
  soundOverdue: true,
  soundRush: true,
  layoutDensity: 'comfortable',
  ticketSize: 'M',
  darkMode: false,
};

function loadSettings(): KitchenSettings {
  return getItem<KitchenSettings>(STORAGE_KEYS.kitchenSettings) ?? DEFAULT_SETTINGS;
}

function loadOfflineQueue(): QueuedKitchenAction[] {
  return getItem<QueuedKitchenAction[]>(STORAGE_KEYS.kitchenOfflineQueue) ?? [];
}

// ─── Store interface ───────────────────────────────────────────────────────────

interface KitchenState {
  // Tickets
  tickets: KitchenTicket[];
  isLoading: boolean;

  // Connectivity
  isOnline: boolean;

  // Offline action queue
  offlineQueue: QueuedKitchenAction[];

  // Settings (persisted to localStorage manually)
  settings: KitchenSettings;

  // Ticket actions
  setTickets: (tickets: KitchenTicket[]) => void;
  upsertTicket: (ticket: KitchenTicket) => void;
  removeTicket: (orderId: string) => void;
  updateTicketStatus: (orderId: string, status: KitchenOrderStatus) => void;
  setLoading: (loading: boolean) => void;

  // Connectivity
  setOnline: (online: boolean) => void;

  // Offline queue
  enqueueAction: (type: KitchenActionType, orderId: string) => QueuedKitchenAction;
  dequeueAction: (id: string) => void;
  clearOfflineQueue: () => void;

  // Settings
  updateSettings: (patch: Partial<KitchenSettings>) => void;
  resetSettings: () => void;
}

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useKitchenStore = create<KitchenState>((set) => ({
  tickets: [],
  isLoading: false,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  offlineQueue: loadOfflineQueue(),
  settings: loadSettings(),

  setTickets: (tickets) => {
    set({ tickets });
    // Cache for offline mode
    setItem(STORAGE_KEYS.kitchenTicketCache, tickets);
  },

  upsertTicket: (ticket) => {
    set((state) => {
      const exists = state.tickets.some((t) => t.orderId === ticket.orderId);
      const updated = exists
        ? state.tickets.map((t) => (t.orderId === ticket.orderId ? ticket : t))
        : [ticket, ...state.tickets];
      setItem(STORAGE_KEYS.kitchenTicketCache, updated);
      return { tickets: updated };
    });
  },

  removeTicket: (orderId) => {
    set((state) => {
      const updated = state.tickets.filter((t) => t.orderId !== orderId);
      setItem(STORAGE_KEYS.kitchenTicketCache, updated);
      return { tickets: updated };
    });
  },

  updateTicketStatus: (orderId, status) => {
    set((state) => {
      const updated = state.tickets.map((t) =>
        t.orderId === orderId ? { ...t, status } : t,
      );
      setItem(STORAGE_KEYS.kitchenTicketCache, updated);
      return { tickets: updated };
    });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setOnline: (isOnline) => set({ isOnline }),

  enqueueAction: (type, orderId) => {
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const action: QueuedKitchenAction = { id, type, orderId, timestamp: Date.now() };
    set((state) => {
      const updated = [...state.offlineQueue, action];
      setItem(STORAGE_KEYS.kitchenOfflineQueue, updated);
      return { offlineQueue: updated };
    });
    return action;
  },

  dequeueAction: (id) => {
    set((state) => {
      const updated = state.offlineQueue.filter((a) => a.id !== id);
      setItem(STORAGE_KEYS.kitchenOfflineQueue, updated);
      return { offlineQueue: updated };
    });
  },

  clearOfflineQueue: () => {
    set({ offlineQueue: [] });
    setItem(STORAGE_KEYS.kitchenOfflineQueue, []);
  },

  updateSettings: (patch) => {
    set((state) => {
      const updated = { ...state.settings, ...patch };
      setItem(STORAGE_KEYS.kitchenSettings, updated);
      return { settings: updated };
    });
  },

  resetSettings: () => {
    setItem(STORAGE_KEYS.kitchenSettings, DEFAULT_SETTINGS);
    set({ settings: DEFAULT_SETTINGS });
  },
}));

// ─── Selectors (memoized helpers) ─────────────────────────────────────────────

/** Returns tickets filtered by current settings. */
export function selectFilteredTickets(
  tickets: KitchenTicket[],
  settings: KitchenSettings,
): KitchenTicket[] {
  return tickets.filter((t) => {
    if (settings.stationFilter !== 'all' && t.station !== settings.stationFilter) return false;
    if (settings.chefFilter && t.chefAssigned !== settings.chefFilter) return false;
    if (settings.orderTypeFilter === 'table' && t.isOnlineOrder) return false;
    if (settings.orderTypeFilter === 'online' && !t.isOnlineOrder) return false;
    if (settings.priorityFilter !== 'all' && t.priority !== settings.priorityFilter) return false;
    return true;
  });
}
