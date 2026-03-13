import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReceiptsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.receipt.findMany({
      include: { order: { include: { items: { include: { menuItem: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const receipt = await this.prisma.receipt.findUnique({
      where: { id },
      include: { order: { include: { items: { include: { menuItem: true } }, table: true } } },
    });
    if (!receipt) throw new NotFoundException('Receipt not found');
    return receipt;
  }

  async findByOrder(orderId: string) {
    const receipt = await this.prisma.receipt.findUnique({
      where: { orderId },
      include: { order: { include: { items: { include: { menuItem: true } }, table: true } } },
    });
    if (!receipt) throw new NotFoundException('Receipt not found for this order');
    return receipt;
  }
}
