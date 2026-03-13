import type { MenuItem, MenuCategory } from '@/types/menu';
import type { Table } from '@/types/tables';
import type { Order } from '@/types/orders';
import type { InventoryItem } from '@/types/inventory';
import type { Reservation } from '@/types/reservations';
import type { KitchenTicket, Recipe } from '@/types/kitchen';

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

// ─── Kitchen Display System sample data ───────────────────────────────────────

export const sampleKitchenTickets: KitchenTicket[] = [
  {
    id: 'kt-1',
    orderId: 'ord-kt-1',
    tableNumber: 4,
    isOnlineOrder: false,
    timePlaced: new Date(Date.now() - 8 * 60000).toISOString(),
    timeDue: new Date(Date.now() + 4 * 60000).toISOString(),
    estimatedMinutes: 12,
    status: 'preparing',
    chefAssigned: 'Chef Marco',
    priority: 'normal',
    station: 'grill',
    items: [
      { id: 'kti-1', menuItemId: 'item-6', name: 'Ribeye Steak', quantity: 2, recipeId: 'rec-1' },
      { id: 'kti-2', menuItemId: 'item-5', name: 'Grilled Salmon', quantity: 1, recipeId: 'rec-2' },
      { id: 'kti-3', menuItemId: 'item-3', name: 'Lemonade', quantity: 3 },
    ],
  },
  {
    id: 'kt-2',
    orderId: 'ord-kt-2',
    tableNumber: 7,
    isOnlineOrder: false,
    timePlaced: new Date(Date.now() - 3 * 60000).toISOString(),
    timeDue: new Date(Date.now() + 12 * 60000).toISOString(),
    estimatedMinutes: 15,
    status: 'new',
    priority: 'rush',
    station: 'fryer',
    items: [
      { id: 'kti-4', menuItemId: 'item-1', name: 'Mozzarella Sticks', quantity: 2, recipeId: 'rec-3', notes: 'Extra crispy' },
      { id: 'kti-5', menuItemId: 'item-4', name: 'Iced Coffee', quantity: 1 },
    ],
  },
  {
    id: 'kt-3',
    orderId: 'ord-kt-3',
    isOnlineOrder: true,
    customerName: 'Alice Johnson',
    timePlaced: new Date(Date.now() - 20 * 60000).toISOString(),
    timeDue: new Date(Date.now() - 3 * 60000).toISOString(),
    estimatedMinutes: 17,
    status: 'overdue',
    chefAssigned: 'Chef Lisa',
    priority: 'vip',
    station: 'grill',
    items: [
      { id: 'kti-6', menuItemId: 'item-7', name: 'Pasta Primavera', quantity: 1, recipeId: 'rec-4' },
      { id: 'kti-7', menuItemId: 'item-2', name: 'Caesar Salad', quantity: 2 },
    ],
    notes: 'VIP guest — allergic to shellfish',
  },
  {
    id: 'kt-4',
    orderId: 'ord-kt-4',
    tableNumber: 12,
    isOnlineOrder: false,
    timePlaced: new Date(Date.now() - 30 * 60000).toISOString(),
    timeDue: new Date(Date.now() - 10 * 60000).toISOString(),
    estimatedMinutes: 20,
    status: 'ready',
    chefAssigned: 'Chef Marco',
    priority: 'normal',
    station: 'dessert',
    items: [
      { id: 'kti-8', menuItemId: 'item-8', name: 'Chocolate Lava Cake', quantity: 2, recipeId: 'rec-5' },
      { id: 'kti-9', menuItemId: 'item-9', name: 'Cheesecake', quantity: 1, recipeId: 'rec-6' },
    ],
  },
  {
    id: 'kt-5',
    orderId: 'ord-kt-5',
    tableNumber: 3,
    isOnlineOrder: false,
    timePlaced: new Date(Date.now() - 1 * 60000).toISOString(),
    timeDue: new Date(Date.now() + 19 * 60000).toISOString(),
    estimatedMinutes: 20,
    status: 'new',
    priority: 'large_order',
    station: 'prep',
    items: [
      { id: 'kti-10', menuItemId: 'item-5', name: 'Grilled Salmon', quantity: 4, recipeId: 'rec-2' },
      { id: 'kti-11', menuItemId: 'item-6', name: 'Ribeye Steak', quantity: 3, recipeId: 'rec-1' },
      { id: 'kti-12', menuItemId: 'item-7', name: 'Pasta Primavera', quantity: 2, recipeId: 'rec-4' },
      { id: 'kti-13', menuItemId: 'item-2', name: 'Caesar Salad', quantity: 4 },
    ],
  },
];

export const sampleRecipes: Recipe[] = [
  {
    id: 'rec-1',
    dishName: 'Ribeye Steak',
    ingredients: [
      { id: 'ri-1', name: 'Ribeye beef', amount: 12, unit: 'oz', inventoryId: 'inv-2' },
      { id: 'ri-2', name: 'Garlic butter', amount: 2, unit: 'tbsp' },
      { id: 'ri-3', name: 'Fresh rosemary', amount: 2, unit: 'sprigs' },
      { id: 'ri-4', name: 'Sea salt', amount: 1, unit: 'tsp' },
      { id: 'ri-5', name: 'Black pepper', amount: 0.5, unit: 'tsp' },
      { id: 'ri-6', name: 'Mashed potatoes', amount: 6, unit: 'oz' },
    ],
    servingSize: 1,
    prepInstructions:
      '1. Season steak on both sides with salt and pepper.\n2. Heat cast iron skillet to high heat.\n3. Sear steak 3-4 minutes per side for medium-rare.\n4. Baste with garlic butter and rosemary.\n5. Rest 5 minutes before plating.',
  },
  {
    id: 'rec-2',
    dishName: 'Grilled Salmon',
    ingredients: [
      { id: 'ri-7', name: 'Atlantic salmon', amount: 8, unit: 'oz', inventoryId: 'inv-1' },
      { id: 'ri-8', name: 'Lemon butter sauce', amount: 2, unit: 'oz' },
      { id: 'ri-9', name: 'Fresh dill', amount: 1, unit: 'tbsp' },
      { id: 'ri-10', name: 'Mixed vegetables', amount: 4, unit: 'oz' },
    ],
    servingSize: 1,
    prepInstructions:
      '1. Season salmon with salt and dill.\n2. Grill 4 minutes per side.\n3. Plate over vegetables.\n4. Drizzle with lemon butter sauce.',
  },
  {
    id: 'rec-3',
    dishName: 'Mozzarella Sticks',
    ingredients: [
      { id: 'ri-11', name: 'Mozzarella', amount: 6, unit: 'oz', inventoryId: 'inv-3' },
      { id: 'ri-12', name: 'Breadcrumbs', amount: 0.5, unit: 'cup' },
      { id: 'ri-13', name: 'Eggs', amount: 2, unit: 'pcs' },
      { id: 'ri-14', name: 'Marinara sauce', amount: 3, unit: 'oz' },
    ],
    servingSize: 6,
    prepInstructions:
      '1. Cut mozzarella into sticks.\n2. Dip in egg wash, coat in breadcrumbs.\n3. Freeze 15 minutes.\n4. Fry at 375°F for 3-4 minutes until golden.',
  },
  {
    id: 'rec-4',
    dishName: 'Pasta Primavera',
    ingredients: [
      { id: 'ri-15', name: 'Fettuccine', amount: 4, unit: 'oz', inventoryId: 'inv-4' },
      { id: 'ri-16', name: 'Olive oil', amount: 2, unit: 'tbsp' },
      { id: 'ri-17', name: 'Garlic', amount: 3, unit: 'cloves' },
      { id: 'ri-18', name: 'Mixed vegetables', amount: 6, unit: 'oz' },
      { id: 'ri-19', name: 'Parmesan', amount: 1, unit: 'oz' },
    ],
    servingSize: 1,
    prepInstructions:
      '1. Cook pasta al dente.\n2. Sauté garlic and vegetables in olive oil.\n3. Toss with pasta.\n4. Finish with parmesan.',
  },
  {
    id: 'rec-5',
    dishName: 'Chocolate Lava Cake',
    ingredients: [
      { id: 'ri-20', name: 'Dark chocolate', amount: 3, unit: 'oz' },
      { id: 'ri-21', name: 'Butter', amount: 2, unit: 'tbsp' },
      { id: 'ri-22', name: 'Eggs', amount: 2, unit: 'pcs' },
      { id: 'ri-23', name: 'Sugar', amount: 2, unit: 'tbsp' },
      { id: 'ri-24', name: 'Flour', amount: 1, unit: 'tbsp' },
      { id: 'ri-25', name: 'Vanilla ice cream', amount: 2, unit: 'scoops' },
    ],
    servingSize: 1,
    prepInstructions:
      '1. Melt chocolate and butter together.\n2. Whisk in eggs and sugar.\n3. Fold in flour.\n4. Pour into ramekin.\n5. Bake at 425°F for 12 minutes — center should remain molten.',
  },
  {
    id: 'rec-6',
    dishName: 'New York Cheesecake',
    ingredients: [
      { id: 'ri-26', name: 'Cream cheese', amount: 8, unit: 'oz' },
      { id: 'ri-27', name: 'Graham cracker crust', amount: 1, unit: 'slice' },
      { id: 'ri-28', name: 'Strawberry topping', amount: 2, unit: 'oz' },
    ],
    servingSize: 1,
    prepInstructions: '1. Slice pre-made cheesecake.\n2. Top with strawberry sauce.\n3. Serve chilled.',
  },
];
