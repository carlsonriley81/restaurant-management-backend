import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInventoryDto, UpdateInventoryQuantityDto } from './dto/create-inventory.dto';
import { EventsGateway } from '../../gateway/events.gateway';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async findAll(lowStock?: boolean) {
    const items = await this.prisma.inventoryItem.findMany({
      orderBy: { productName: 'asc' },
    });
    if (lowStock) {
      return items.filter((i) => Number(i.quantityOnHand) <= Number(i.lowStockThreshold));
    }
    return items;
  }

  async findOne(id: string) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');
    return item;
  }

  async create(dto: CreateInventoryDto) {
    return this.prisma.inventoryItem.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateInventoryDto>) {
    await this.findOne(id);
    const item = await this.prisma.inventoryItem.update({ where: { id }, data: dto });
    await this.checkLowStock(item);
    return item;
  }

  async adjustQuantity(id: string, dto: UpdateInventoryQuantityDto) {
    await this.findOne(id);
    const item = await this.prisma.inventoryItem.update({
      where: { id },
      data: {
        quantityOnHand: { increment: dto.quantity },
        ...(dto.quantity > 0 && { lastReceivedDate: new Date() }),
      },
    });
    await this.checkLowStock(item);
    return item;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.inventoryItem.delete({ where: { id } });
  }

  private async checkLowStock(item: any) {
    if (Number(item.quantityOnHand) <= Number(item.lowStockThreshold)) {
      this.eventsGateway.emitInventoryAlert({
        itemId: item.id,
        productName: item.productName,
        quantityOnHand: item.quantityOnHand,
        lowStockThreshold: item.lowStockThreshold,
      });
    }
  }
}
