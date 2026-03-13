import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PosService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [activeOrders, availableTables, allInventory, todayRevenue] = await Promise.all([
      this.prisma.order.count({
        where: { orderStatus: { notIn: ['COMPLETED', 'CANCELLED'] } },
      }),
      this.prisma.table.count({ where: { status: 'AVAILABLE' } }),
      this.prisma.inventoryItem.findMany({
        select: { quantityOnHand: true, lowStockThreshold: true },
      }),
      this.prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: today },
        },
        _sum: { totalPrice: true },
      }),
    ]);

    const lowStockCount = allInventory.filter(
      (i) => Number(i.quantityOnHand) <= Number(i.lowStockThreshold),
    ).length;

    return {
      activeOrders,
      availableTables,
      lowStockCount,
      todayRevenue: todayRevenue._sum.totalPrice || 0,
    };
  }

  async getActiveOrders() {
    return this.prisma.order.findMany({
      where: { orderStatus: { notIn: ['COMPLETED', 'CANCELLED'] } },
      include: {
        items: { include: { menuItem: true } },
        table: true,
        server: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { orderPlacedTime: 'asc' },
    });
  }
}
