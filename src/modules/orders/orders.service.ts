import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, ProcessPaymentDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { EventsGateway } from '../../gateway/events.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async findAll(status?: string) {
    return this.prisma.order.findMany({
      where: status ? { orderStatus: status as OrderStatus } : {},
      include: {
        items: { include: { menuItem: true } },
        table: true,
        chef: { select: { id: true, firstName: true, lastName: true } },
        server: { select: { id: true, firstName: true, lastName: true } },
        discount: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { menuItem: true } },
        table: true,
        chef: { select: { id: true, firstName: true, lastName: true } },
        server: { select: { id: true, firstName: true, lastName: true } },
        discount: true,
        kitchenTicket: true,
        receipt: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(dto: CreateOrderDto, employeeId: string) {
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: dto.items.map((i) => i.menuItemId) } },
    });

    let totalPrice = 0;
    const itemsData = dto.items.map((item) => {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId);
      if (!menuItem) throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
      const unitPrice = Number(menuItem.price);
      totalPrice += unitPrice * item.quantity;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice,
        notes: item.notes,
      };
    });

    let discountAmount = 0;
    if (dto.discountId) {
      const discount = await this.prisma.discount.findUnique({ where: { id: dto.discountId } });
      if (discount && discount.active) {
        if (discount.type === 'PERCENTAGE' && discount.percentage) {
          discountAmount = totalPrice * (Number(discount.percentage) / 100);
        } else if (discount.type === 'FIXED_AMOUNT' && discount.fixedAmount) {
          discountAmount = Number(discount.fixedAmount);
        }
        await this.prisma.discount.update({
          where: { id: dto.discountId },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const order = await this.prisma.order.create({
      data: {
        serverId: employeeId,
        tableId: dto.tableId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        customerEmail: dto.customerEmail,
        notes: dto.notes,
        discountId: dto.discountId,
        discountAmount,
        tipAmount: dto.tipAmount || 0,
        totalPrice: totalPrice - discountAmount,
        items: { create: itemsData },
      },
      include: { items: { include: { menuItem: true } }, table: true },
    });

    // Create kitchen ticket
    await this.prisma.kitchenTicket.create({
      data: { orderId: order.id },
    });

    this.eventsGateway.emitOrderUpdate(order.id, { status: 'PLACED', order });
    this.eventsGateway.emitKitchenTicket({ orderId: order.id, items: order.items });

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    await this.findOne(id);
    const order = await this.prisma.order.update({
      where: { id },
      data: { orderStatus: dto.status as OrderStatus },
    });
    this.eventsGateway.emitOrderUpdate(id, { status: dto.status });
    return order;
  }

  async processPayment(id: string, dto: ProcessPaymentDto) {
    const order = await this.findOne(id);
    if (order.paymentStatus === 'PAID') {
      throw new BadRequestException('Order already paid');
    }
    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: dto.paymentMethod,
        tipAmount: dto.tipAmount ?? order.tipAmount,
        orderStatus: OrderStatus.COMPLETED,
      },
    });

    // Create receipt
    const taxRate = 0.08;
    const subtotal = Number(order.totalPrice) + Number(order.discountAmount);
    const taxAmount = subtotal * taxRate;
    const total = Number(order.totalPrice) + taxAmount + Number(dto.tipAmount ?? order.tipAmount);

    await this.prisma.receipt.upsert({
      where: { orderId: id },
      create: {
        orderId: id,
        subtotal,
        taxAmount,
        discountAmount: Number(order.discountAmount),
        tipAmount: Number(dto.tipAmount ?? order.tipAmount),
        totalAmount: total,
        paymentMethod: dto.paymentMethod,
        paymentStatus: PaymentStatus.PAID,
      },
      update: {
        paymentMethod: dto.paymentMethod,
        paymentStatus: PaymentStatus.PAID,
        tipAmount: Number(dto.tipAmount ?? order.tipAmount),
        totalAmount: total,
      },
    });

    if (order.tableId) {
      await this.prisma.table.update({
        where: { id: order.tableId },
        data: { status: 'AVAILABLE' },
      });
      this.eventsGateway.emitTableUpdate(order.tableId, { status: 'AVAILABLE' });
    }

    this.eventsGateway.emitOrderUpdate(id, { status: 'COMPLETED', paymentStatus: 'PAID' });
    return updated;
  }

  async assignChef(orderId: string, chefId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { chefId },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.delete({ where: { id } });
  }
}
