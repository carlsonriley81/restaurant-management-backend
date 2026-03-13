export interface SalesReport {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topItems: Array<{ name: string; count: number; revenue: number }>;
}

export interface InventoryReport {
  lowStockItems: number;
  expiringItems: number;
  wasteValue: number;
  items: Array<{ name: string; quantity: number; status: string }>;
}

export interface EmployeeReport {
  employee: string;
  hoursWorked: number;
  totalPay: number;
  tips: number;
}

export interface KitchenReport {
  mostOrderedDishes: Array<{ name: string; count: number }>;
  averagePrepTime: number;
  totalPrepLogs: number;
}
