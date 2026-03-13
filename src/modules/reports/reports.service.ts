import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSalesSummary(startDate: string, endDate: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: { items: { include: { menuItem: true } } },
    });

    const totalRevenue = orders.reduce((acc, o) => acc + Number(o.totalPrice), 0);
    const totalOrders = orders.length;
    const totalTips = orders.reduce((acc, o) => acc + Number(o.tipAmount), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const itemSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const order of orders) {
      for (const item of order.items) {
        const key = item.menuItemId;
        const existing = itemSales.get(key) || { name: item.menuItem.name, quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += Number(item.unitPrice) * item.quantity;
        itemSales.set(key, existing);
      }
    }

    return {
      totalRevenue,
      totalOrders,
      totalTips,
      averageOrderValue,
      topItems: Array.from(itemSales.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10),
    };
  }

  async getInventoryReport() {
    const items = await this.prisma.inventoryItem.findMany({ orderBy: { productName: 'asc' } });
    const lowStock = items.filter((i) => Number(i.quantityOnHand) <= Number(i.lowStockThreshold));
    const expiringSoon = items.filter((i) => {
      if (!i.expirationDate) return false;
      const daysUntilExpiry = (i.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry <= 7;
    });
    return { totalItems: items.length, lowStock, expiringSoon, items };
  }

  async getEmployeeReport(startDate: string, endDate: string) {
    const shifts = await this.prisma.shift.findMany({
      where: {
        startTime: { gte: new Date(startDate) },
        endTime: { lte: new Date(endDate) },
      },
      include: { employee: { select: { id: true, firstName: true, lastName: true, role: true, hourlyWage: true } } },
    });

    const employeeMap = new Map<string, any>();
    for (const shift of shifts) {
      const key = shift.employeeId;
      const existing = employeeMap.get(key) || {
        employee: shift.employee,
        totalHours: 0,
        shifts: [],
      };
      existing.totalHours += Number(shift.hoursWorked || 0);
      existing.shifts.push(shift);
      employeeMap.set(key, existing);
    }

    return Array.from(employeeMap.values()).map((e) => ({
      ...e,
      estimatedPay: e.totalHours * Number(e.employee.hourlyWage),
    }));
  }

  async getKitchenReport(startDate: string, endDate: string) {
    const tickets = await this.prisma.kitchenTicket.findMany({
      where: {
        timeOrdered: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: { order: { include: { items: { include: { menuItem: true } } } } },
    });

    const statusCounts = tickets.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { total: tickets.length, statusCounts, tickets };
  }
}
