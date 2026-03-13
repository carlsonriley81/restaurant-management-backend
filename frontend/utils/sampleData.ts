import type { MenuItem, MenuCategory } from '@/types/menu';
import type { Table } from '@/types/tables';
import type { Order } from '@/types/orders';
import type { InventoryItem } from '@/types/inventory';
import type { Reservation } from '@/types/reservations';

export const sampleCategories: MenuCategory[] = [
  { id: 'cat-1', name: 'Appetizers' },
  { id: 'cat-2', name: 'Drinks' },
  { id: 'cat-3', name: 'Main Dishes' },
  { id: 'cat-4', name: 'Desserts' },
];

export const sampleMenuItems: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Mozzarella Sticks',
    description: 'Golden fried mozzarella with marinara sauce',
    price: 8.99,
    category: 'Appetizers',
    active: true,
    limitedTime: false,
  },
  {
    id: 'item-2',
    name: 'Caesar Salad',
    description: 'Romaine, parmesan, croutons, caesar dressing',
    price: 10.99,
    category: 'Appetizers',
    active: true,
    limitedTime: false,
  },
  {
    id: 'item-3',
    name: 'Lemonade',
    description: 'Fresh squeezed with mint',
    price: 3.99,
    category: 'Drinks',
    active: true,
    limitedTime: false,
  },
  {
    id: 'item-4',
    name: 'Iced Coffee',
    description: 'Cold brew over ice',
    price: 4.99,
    category: 'Drinks',
    active: true,
    limitedTime: false,
  },
  {
    id: 'item-5',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with lemon butter sauce and vegetables',
    price: 22.99,
    category: 'Main Dishes',
    active: true,
    limitedTime: false,
  },
  {
    id: 'item-6',
    name: 'Ribeye Steak',
    description: '12oz hand-cut with garlic mashed potatoes',
    price: 34.99,
    category: 'Main Dishes',
    active: true,
    limitedTime: false,
  },
  {
    id: 'item-7',
    name: 'Pasta Primavera',
    description: 'Fresh vegetables tossed in olive oil and garlic',
    price: 14.99,
    category: 'Main Dishes',
    active: true,
    limitedTime: false,
  },
  {
    id: 'item-8',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with vanilla ice cream',
    price: 7.99,
    category: 'Desserts',
    active: true,
    limitedTime: true,
  },
  {
    id: 'item-9',
    name: 'Cheesecake',
    description: 'New York style with strawberry topping',
    price: 6.99,
    category: 'Desserts',
    active: true,
    limitedTime: false,
  },
];

export const sampleTables: Table[] = [
  { id: 'tbl-1', tableNumber: 1, capacity: 2, status: 'available' },
  { id: 'tbl-2', tableNumber: 2, capacity: 4, status: 'seated', serverAssigned: 'Alice', currentTotal: 45.5 },
  { id: 'tbl-3', tableNumber: 3, capacity: 4, status: 'ordering', serverAssigned: 'Bob', currentTotal: 22.0 },
  { id: 'tbl-4', tableNumber: 4, capacity: 6, status: 'food_preparing', serverAssigned: 'Alice', currentTotal: 87.5 },
  { id: 'tbl-5', tableNumber: 5, capacity: 2, status: 'served', serverAssigned: 'Charlie', currentTotal: 34.0 },
  { id: 'tbl-6', tableNumber: 6, capacity: 8, status: 'paid' },
  { id: 'tbl-7', tableNumber: 7, capacity: 4, status: 'available' },
  { id: 'tbl-8', tableNumber: 8, capacity: 2, status: 'available' },
];

export const sampleOrders: Order[] = [
  {
    id: 'ord-1',
    orderStatus: 'preparing',
    orderPlacedTime: new Date(Date.now() - 15 * 60000).toISOString(),
    estimatedWaitTime: 20,
    chefAssigned: 'Chef Marco',
    paymentStatus: 'pending',
    tableId: 'tbl-2',
    tableNumber: 2,
    items: [
      { id: 'oi-1', menuItemId: 'item-5', name: 'Grilled Salmon', price: 22.99, quantity: 1 },
      { id: 'oi-2', menuItemId: 'item-3', name: 'Lemonade', price: 3.99, quantity: 2 },
    ],
    totalPrice: 30.97,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ord-2',
    orderStatus: 'placed',
    orderPlacedTime: new Date(Date.now() - 5 * 60000).toISOString(),
    estimatedWaitTime: 25,
    paymentStatus: 'pending',
    tableId: 'tbl-3',
    tableNumber: 3,
    items: [
      { id: 'oi-3', menuItemId: 'item-6', name: 'Ribeye Steak', price: 34.99, quantity: 1 },
      { id: 'oi-4', menuItemId: 'item-4', name: 'Iced Coffee', price: 4.99, quantity: 1 },
    ],
    totalPrice: 39.98,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const sampleInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    productName: 'Atlantic Salmon',
    quantityOnHand: 5,
    supplierName: 'Fresh Catch Co.',
    costToOrder: 12.5,
    expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    unit: 'lbs',
    lowStockThreshold: 10,
  },
  {
    id: 'inv-2',
    productName: 'Ribeye Beef',
    quantityOnHand: 20,
    supplierName: 'Prime Meats',
    costToOrder: 18.0,
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    unit: 'lbs',
    lowStockThreshold: 15,
  },
  {
    id: 'inv-3',
    productName: 'Mozzarella',
    quantityOnHand: 3,
    supplierName: 'Dairy Direct',
    costToOrder: 5.0,
    expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    unit: 'lbs',
    lowStockThreshold: 8,
  },
  {
    id: 'inv-4',
    productName: 'Pasta',
    quantityOnHand: 50,
    supplierName: 'Pantry Plus',
    costToOrder: 2.5,
    unit: 'lbs',
    lowStockThreshold: 20,
  },
];

export const sampleReservations: Reservation[] = [
  {
    id: 'res-1',
    reservationName: 'Johnson Family',
    reservationTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    partySize: 6,
    tablesReserved: ['tbl-4'],
    depositPaid: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'res-2',
    reservationName: 'Smith Anniversary',
    reservationTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    partySize: 2,
    tablesReserved: ['tbl-1'],
    depositPaid: false,
    notes: 'Anniversary dinner - candles please',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
