/**
 * Kitchen Display System (KDS) — TypeScript types.
 */

export type KitchenOrderStatus = 'new' | 'preparing' | 'ready' | 'overdue' | 'completed';

export type KitchenPriority = 'normal' | 'rush' | 'vip' | 'large_order';

export type KitchenStation = 'grill' | 'fryer' | 'salad' | 'dessert' | 'drinks' | 'prep' | 'bar';

export type TicketSize = 'S' | 'M' | 'L';

export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';

// ─── Ticket ────────────────────────────────────────────────────────────────────

export interface KitchenTicketItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  notes?: string;
  recipeId?: string;
}

export interface KitchenTicket {
  id: string;
  orderId: string;
  tableNumber?: number;
  isOnlineOrder: boolean;
  customerName?: string;
  timePlaced: string;       // ISO timestamp
  timeDue?: string;         // ISO timestamp — deadline
  estimatedMinutes?: number;
  status: KitchenOrderStatus;
  chefAssigned?: string;
  items: KitchenTicketItem[];
  priority: KitchenPriority;
  station?: KitchenStation;
  notes?: string;
}

// ─── Recipe ────────────────────────────────────────────────────────────────────

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  inventoryId?: string;
}

export interface Recipe {
  id: string;
  dishName: string;
  dishImage?: string;
  ingredients: RecipeIngredient[];
  servingSize: number;
  prepInstructions?: string;
  limitedTime?: boolean;
}

// ─── Settings ──────────────────────────────────────────────────────────────────

export interface KitchenSettings {
  stationFilter: KitchenStation | 'all';
  chefFilter: string;
  orderTypeFilter: 'all' | 'table' | 'online';
  priorityFilter: KitchenPriority | 'all';
  soundEnabled: boolean;
  soundNewOrder: boolean;
  soundOverdue: boolean;
  soundRush: boolean;
  layoutDensity: LayoutDensity;
  ticketSize: TicketSize;
  darkMode: boolean;
}

// ─── Offline queue ─────────────────────────────────────────────────────────────

export type KitchenActionType = 'start' | 'mark_ready' | 'send_to_server' | 'complete';

export interface QueuedKitchenAction {
  id: string;
  type: KitchenActionType;
  orderId: string;
  timestamp: number;
}
