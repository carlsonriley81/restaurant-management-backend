import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { KitchenTicketStatus } from '@prisma/client';
import { EventsGateway } from '../../gateway/events.gateway';

@Injectable()
export class KitchenService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async findAllTickets(status?: string) {
    return this.prisma.kitchenTicket.findMany({
      where: status ? { status: status as KitchenTicketStatus } : {},
      include: {
        order: {
          include: {
            items: { include: { menuItem: true } },
            table: true,
          },
        },
      },
      orderBy: { timeOrdered: 'asc' },
    });
  }

  async findTicket(id: string) {
    const ticket = await this.prisma.kitchenTicket.findUnique({
      where: { id },
      include: { order: { include: { items: { include: { menuItem: true } }, table: true } } },
    });
    if (!ticket) throw new NotFoundException('Kitchen ticket not found');
    return ticket;
  }

  async updateTicketStatus(id: string, status: KitchenTicketStatus) {
    await this.findTicket(id);
    const ticket = await this.prisma.kitchenTicket.update({
      where: { id },
      data: { status },
      include: { order: true },
    });

    const orderStatusMap: Record<string, string> = {
      IN_PROGRESS: 'PREPARING',
      READY: 'READY',
      DELIVERED: 'SERVED',
    };

    if (orderStatusMap[status]) {
      await this.prisma.order.update({
        where: { id: ticket.orderId },
        data: { orderStatus: orderStatusMap[status] as any },
      });
      this.eventsGateway.emitOrderUpdate(ticket.orderId, { status: orderStatusMap[status] });
    }

    return ticket;
  }

  async getActivePrepLogs() {
    return this.prisma.prepLog.findMany({
      include: { inventoryUsed: { include: { inventory: true } } },
      orderBy: { datePrepped: 'desc' },
    });
  }
}
