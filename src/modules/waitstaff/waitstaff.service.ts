import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WaitstaffService {
  constructor(private prisma: PrismaService) {}

  async getMyTables(serverId: string) {
    return this.prisma.table.findMany({
      where: { serverId },
      include: {
        orders: {
          where: { orderStatus: { notIn: ['COMPLETED', 'CANCELLED'] } },
          include: { items: { include: { menuItem: true } } },
        },
      },
      orderBy: { tableNumber: 'asc' },
    });
  }

  async getMyOrders(serverId: string) {
    return this.prisma.order.findMany({
      where: {
        serverId,
        orderStatus: { notIn: ['COMPLETED', 'CANCELLED'] },
      },
      include: {
        items: { include: { menuItem: true } },
        table: true,
        kitchenTicket: true,
      },
      orderBy: { orderPlacedTime: 'asc' },
    });
  }

  async getMyStats(serverId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [ordersToday, tipsToday, completedOrders] = await Promise.all([
      this.prisma.order.count({ where: { serverId, createdAt: { gte: today } } }),
      this.prisma.order.aggregate({
        where: { serverId, paymentStatus: 'PAID', createdAt: { gte: today } },
        _sum: { tipAmount: true },
      }),
      this.prisma.order.count({
        where: { serverId, orderStatus: 'COMPLETED', createdAt: { gte: today } },
      }),
    ]);

    return {
      ordersToday,
      tipsToday: tipsToday._sum.tipAmount || 0,
      completedOrders,
    };
  }
}
