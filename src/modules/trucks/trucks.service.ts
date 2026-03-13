import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTruckDto, ReceiveTruckItemDto } from './dto/create-truck.dto';
import { TruckStatus } from '@prisma/client';

@Injectable()
export class TrucksService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    return this.prisma.truck.findMany({
      where: status ? { status: status as TruckStatus } : {},
      include: { items: { include: { inventory: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const truck = await this.prisma.truck.findUnique({
      where: { id },
      include: { items: { include: { inventory: true } } },
    });
    if (!truck) throw new NotFoundException('Truck not found');
    return truck;
  }

  async create(dto: CreateTruckDto) {
    const { items, ...truckData } = dto;
    return this.prisma.truck.create({
      data: {
        ...truckData,
        ...(dto.estimatedArrival && { estimatedArrival: new Date(dto.estimatedArrival) }),
        ...(items && { items: { create: items } }),
      },
      include: { items: true },
    });
  }

  async update(id: string, dto: Partial<CreateTruckDto>) {
    await this.findOne(id);
    const { items, ...truckData } = dto;
    return this.prisma.truck.update({ where: { id }, data: truckData });
  }

  async updateStatus(id: string, status: TruckStatus) {
    await this.findOne(id);
    const truck = await this.prisma.truck.update({
      where: { id },
      data: { status, ...(status === 'ARRIVED' && { arrivalDate: new Date() }) },
    });
    return truck;
  }

  async receiveItem(dto: ReceiveTruckItemDto) {
    const item = await this.prisma.truckItem.findUnique({
      where: { id: dto.itemId },
      include: { inventory: true },
    });
    if (!item) throw new NotFoundException('Truck item not found');

    await this.prisma.truckItem.update({ where: { id: dto.itemId }, data: { received: dto.received } });

    if (dto.received && item.inventoryId) {
      await this.prisma.inventoryItem.update({
        where: { id: item.inventoryId },
        data: {
          quantityOnHand: { increment: Number(item.quantity) },
          lastReceivedDate: new Date(),
        },
      });
    }
    return { success: true };
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.truck.delete({ where: { id } });
  }
}
