import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string, active?: boolean) {
    return this.prisma.menuItem.findMany({
      where: {
        ...(category && { category }),
        ...(active !== undefined && { active }),
      },
      include: { recipe: true },
      orderBy: { category: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { recipe: { include: { ingredients: { include: { inventory: true } } } } },
    });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async create(dto: CreateMenuItemDto) {
    return this.prisma.menuItem.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateMenuItemDto>) {
    await this.findOne(id);
    return this.prisma.menuItem.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.menuItem.delete({ where: { id } });
  }

  async getCategories() {
    const items = await this.prisma.menuItem.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return items.map((i) => i.category);
  }
}
