import { PrismaClient, Role, TableStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create employees
  const adminHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.employee.upsert({
    where: { email: 'admin@restaurant.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@restaurant.com',
      passwordHash: adminHash,
      role: Role.ADMIN,
      hourlyWage: 25,
      status: 'ACTIVE',
    },
  });
  console.log('✅ Admin created:', admin.email);

  const managerHash = await bcrypt.hash('manager123', 12);
  const manager = await prisma.employee.upsert({
    where: { email: 'manager@restaurant.com' },
    update: {},
    create: {
      firstName: 'Jane',
      lastName: 'Manager',
      email: 'manager@restaurant.com',
      passwordHash: managerHash,
      role: Role.MANAGER,
      hourlyWage: 20,
      status: 'ACTIVE',
    },
  });
  console.log('✅ Manager created:', manager.email);

  const chefHash = await bcrypt.hash('chef123', 12);
  const chef = await prisma.employee.upsert({
    where: { email: 'chef@restaurant.com' },
    update: {},
    create: {
      firstName: 'Gordon',
      lastName: 'Chef',
      email: 'chef@restaurant.com',
      passwordHash: chefHash,
      role: Role.CHEF,
      hourlyWage: 18,
      status: 'ACTIVE',
    },
  });
  console.log('✅ Chef created:', chef.email);

  const serverHash = await bcrypt.hash('server123', 12);
  const server = await prisma.employee.upsert({
    where: { email: 'server@restaurant.com' },
    update: {},
    create: {
      firstName: 'Alex',
      lastName: 'Server',
      email: 'server@restaurant.com',
      passwordHash: serverHash,
      role: Role.SERVER,
      hourlyWage: 12,
      status: 'ACTIVE',
    },
  });
  console.log('✅ Server created:', server.email);

  // Create tables
  const tableData = [
    { tableNumber: 1, capacity: 2, color: '#4CAF50' },
    { tableNumber: 2, capacity: 4, color: '#2196F3' },
    { tableNumber: 3, capacity: 4, color: '#2196F3' },
    { tableNumber: 4, capacity: 6, color: '#FF9800' },
    { tableNumber: 5, capacity: 6, color: '#FF9800' },
    { tableNumber: 6, capacity: 8, color: '#F44336' },
    { tableNumber: 7, capacity: 2, color: '#4CAF50' },
    { tableNumber: 8, capacity: 4, color: '#2196F3' },
    { tableNumber: 9, capacity: 10, color: '#9C27B0' },
    { tableNumber: 10, capacity: 12, color: '#795548' },
  ];

  for (const t of tableData) {
    await prisma.table.upsert({
      where: { tableNumber: t.tableNumber },
      update: {},
      create: {
        ...t,
        status: TableStatus.AVAILABLE,
        positionX: (t.tableNumber % 3) * 200,
        positionY: Math.floor((t.tableNumber - 1) / 3) * 150,
      },
    });
  }
  console.log('✅ Tables created (10)');

  // Create inventory items
  const inventoryItems = [
    { productName: 'Beef Patty', quantityOnHand: 50, unit: 'lbs', lowStockThreshold: 10, supplierName: 'Local Farms Co', costToOrder: 8.99 },
    { productName: 'Chicken Breast', quantityOnHand: 30, unit: 'lbs', lowStockThreshold: 8, supplierName: 'Poultry Plus', costToOrder: 5.49 },
    { productName: 'Burger Bun', quantityOnHand: 100, unit: 'units', lowStockThreshold: 20, supplierName: 'Bakery Fresh', costToOrder: 0.25 },
    { productName: 'Lettuce', quantityOnHand: 15, unit: 'heads', lowStockThreshold: 5, supplierName: 'Green Garden', costToOrder: 1.50 },
    { productName: 'Tomato', quantityOnHand: 25, unit: 'lbs', lowStockThreshold: 5, supplierName: 'Green Garden', costToOrder: 2.00 },
    { productName: 'Cheddar Cheese', quantityOnHand: 20, unit: 'lbs', lowStockThreshold: 5, supplierName: 'Dairy Direct', costToOrder: 6.00 },
    { productName: 'French Fry Potatoes', quantityOnHand: 80, unit: 'lbs', lowStockThreshold: 20, supplierName: 'Root Veggie Co', costToOrder: 1.20 },
    { productName: 'Pasta', quantityOnHand: 40, unit: 'lbs', lowStockThreshold: 10, supplierName: 'Italian Imports', costToOrder: 2.50 },
    { productName: 'Marinara Sauce', quantityOnHand: 12, unit: 'gallons', lowStockThreshold: 3, supplierName: 'Italian Imports', costToOrder: 8.00 },
    { productName: 'Olive Oil', quantityOnHand: 8, unit: 'gallons', lowStockThreshold: 2, supplierName: 'Mediterranean Co', costToOrder: 12.00 },
    { productName: 'Salt', quantityOnHand: 10, unit: 'lbs', lowStockThreshold: 2, supplierName: 'Spice World', costToOrder: 0.50 },
    { productName: 'Black Pepper', quantityOnHand: 5, unit: 'lbs', lowStockThreshold: 1, supplierName: 'Spice World', costToOrder: 3.00 },
    { productName: 'Flour', quantityOnHand: 50, unit: 'lbs', lowStockThreshold: 10, supplierName: 'Bakery Fresh', costToOrder: 0.60 },
    { productName: 'Eggs', quantityOnHand: 72, unit: 'units', lowStockThreshold: 24, supplierName: 'Local Farms Co', costToOrder: 0.20 },
    { productName: 'Milk', quantityOnHand: 10, unit: 'gallons', lowStockThreshold: 2, supplierName: 'Dairy Direct', costToOrder: 3.50 },
    { productName: 'Soda Syrup - Cola', quantityOnHand: 5, unit: 'boxes', lowStockThreshold: 1, supplierName: 'Beverage Co', costToOrder: 18.00 },
    { productName: 'Soda Syrup - Lemon', quantityOnHand: 3, unit: 'boxes', lowStockThreshold: 1, supplierName: 'Beverage Co', costToOrder: 18.00 },
    { productName: 'Coffee Beans', quantityOnHand: 20, unit: 'lbs', lowStockThreshold: 5, supplierName: 'Roasters Inc', costToOrder: 12.00 },
  ];

  const createdInventory: Record<string, string> = {};
  for (const item of inventoryItems) {
    const inv = await prisma.inventoryItem.create({
      data: item,
    }).catch(() => prisma.inventoryItem.findFirst({ where: { productName: item.productName } }));
    if (inv) createdInventory[item.productName] = inv.id;
  }
  console.log('✅ Inventory items created');

  // Create recipes
  const burgerRecipe = await prisma.recipe.create({
    data: {
      dishName: 'Classic Burger',
      servingSize: 1,
      instructions: '1. Season patty. 2. Grill 4 min each side. 3. Toast bun. 4. Assemble.',
      ingredients: {
        create: [
          { ingredientName: 'Beef Patty', inventoryId: createdInventory['Beef Patty'], amount: 0.5, unit: 'lbs' },
          { ingredientName: 'Burger Bun', inventoryId: createdInventory['Burger Bun'], amount: 1, unit: 'units' },
          { ingredientName: 'Lettuce', inventoryId: createdInventory['Lettuce'], amount: 0.1, unit: 'heads' },
          { ingredientName: 'Tomato', inventoryId: createdInventory['Tomato'], amount: 0.1, unit: 'lbs' },
          { ingredientName: 'Cheddar Cheese', inventoryId: createdInventory['Cheddar Cheese'], amount: 0.1, unit: 'lbs' },
        ],
      },
    },
  });

  const pastaRecipe = await prisma.recipe.create({
    data: {
      dishName: 'Spaghetti Marinara',
      servingSize: 1,
      instructions: '1. Boil pasta. 2. Heat sauce. 3. Combine. 4. Garnish.',
      ingredients: {
        create: [
          { ingredientName: 'Pasta', inventoryId: createdInventory['Pasta'], amount: 0.25, unit: 'lbs' },
          { ingredientName: 'Marinara Sauce', inventoryId: createdInventory['Marinara Sauce'], amount: 0.25, unit: 'gallons' },
          { ingredientName: 'Olive Oil', inventoryId: createdInventory['Olive Oil'], amount: 0.02, unit: 'gallons' },
        ],
      },
    },
  });

  const chickenRecipe = await prisma.recipe.create({
    data: {
      dishName: 'Grilled Chicken',
      servingSize: 1,
      instructions: '1. Marinate chicken. 2. Grill 6 min each side. 3. Rest 5 min. 4. Serve.',
      ingredients: {
        create: [
          { ingredientName: 'Chicken Breast', inventoryId: createdInventory['Chicken Breast'], amount: 0.5, unit: 'lbs' },
          { ingredientName: 'Olive Oil', inventoryId: createdInventory['Olive Oil'], amount: 0.01, unit: 'gallons' },
          { ingredientName: 'Salt', inventoryId: createdInventory['Salt'], amount: 0.02, unit: 'lbs' },
          { ingredientName: 'Black Pepper', inventoryId: createdInventory['Black Pepper'], amount: 0.01, unit: 'lbs' },
        ],
      },
    },
  });
  console.log('✅ Recipes created');

  // Create menu items
  await prisma.menuItem.createMany({
    data: [
      { name: 'Classic Burger', description: 'Beef patty with lettuce, tomato & cheese on toasted bun', price: 12.99, category: 'Burgers', recipeId: burgerRecipe.id, active: true },
      { name: 'Spaghetti Marinara', description: 'Fresh pasta with house marinara sauce', price: 14.99, category: 'Pasta', recipeId: pastaRecipe.id, active: true },
      { name: 'Grilled Chicken', description: 'Seasoned grilled chicken breast', price: 16.99, category: 'Entrees', recipeId: chickenRecipe.id, active: true },
      { name: 'French Fries', description: 'Crispy golden fries', price: 4.99, category: 'Sides', active: true },
      { name: 'Garden Salad', description: 'Fresh mixed greens', price: 7.99, category: 'Salads', active: true },
      { name: 'Cola', description: 'Fountain soda', price: 2.99, category: 'Beverages', active: true },
      { name: 'Lemonade', description: 'Fresh squeezed lemonade', price: 3.49, category: 'Beverages', active: true },
      { name: 'Coffee', description: 'Freshly brewed coffee', price: 2.49, category: 'Beverages', active: true },
      { name: 'Cheeseburger', description: 'Double beef patty with extra cheese', price: 15.99, category: 'Burgers', active: true },
      { name: 'Chicken Sandwich', description: 'Grilled chicken on brioche bun', price: 13.99, category: 'Sandwiches', active: true },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Menu items created');

  // Create discounts
  await prisma.discount.createMany({
    data: [
      { name: 'Happy Hour 20% Off', type: 'PERCENTAGE', percentage: 20, active: true, code: 'HAPPY20' },
      { name: 'Senior Discount', type: 'PERCENTAGE', percentage: 10, active: true, code: 'SENIOR10' },
      { name: '$5 Off Order', type: 'FIXED_AMOUNT', fixedAmount: 5, active: true, code: 'SAVE5' },
      { name: 'Staff Meal', type: 'PERCENTAGE', percentage: 50, active: true, code: 'STAFF50' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Discounts created');

  console.log('');
  console.log('🎉 Seed complete!');
  console.log('');
  console.log('Default credentials:');
  console.log('  Admin:   admin@restaurant.com    / admin123');
  console.log('  Manager: manager@restaurant.com  / manager123');
  console.log('  Chef:    chef@restaurant.com     / chef123');
  console.log('  Server:  server@restaurant.com   / server123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
