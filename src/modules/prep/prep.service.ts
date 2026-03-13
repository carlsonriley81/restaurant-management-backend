import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePrepLogDto } from './dto/create-prep-log.dto';

@Injectable()
export class PrepService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.prepLog.findMany({
      include: { inventoryUsed: { include: { inventory: true } } },
      orderBy: { datePrepped: 'desc' },
    });
  }

  async findOne(id: string) {
    const log = await this.prisma.prepLog.findUnique({
      where: { id },
      include: { inventoryUsed: { include: { inventory: true } } },
    });
    if (!log) throw new NotFoundException('Prep log not found');
    return log;
  }

  async create(dto: CreatePrepLogDto) {
    const { inventoryUsed, ...logData } = dto;

    const prepLog = await this.prisma.prepLog.create({
      data: {
        ...logData,
        ...(inventoryUsed && { inventoryUsed: { create: inventoryUsed } }),
      },
      include: { inventoryUsed: { include: { inventory: true } } },
    });

    // Deduct inventory
    if (inventoryUsed) {
      for (const item of inventoryUsed) {
        await this.prisma.inventoryItem.update({
          where: { id: item.inventoryId },
          data: { quantityOnHand: { decrement: item.amountUsed } },
        });
      }
    }

    return prepLog;
  }

  async update(id: string, dto: Partial<CreatePrepLogDto>) {
    await this.findOne(id);
    const { inventoryUsed, ...logData } = dto;
    return this.prisma.prepLog.update({ where: { id }, data: logData });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.prepLog.delete({ where: { id } });
  }
}
