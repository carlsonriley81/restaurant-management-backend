import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';

@Injectable()
export class DiscountsService {
  constructor(private prisma: PrismaService) {}

  async findAll(active?: boolean) {
    return this.prisma.discount.findMany({
      where: active !== undefined ? { active } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const discount = await this.prisma.discount.findUnique({ where: { id } });
    if (!discount) throw new NotFoundException('Discount not found');
    return discount;
  }

  async findByCode(code: string) {
    const discount = await this.prisma.discount.findUnique({ where: { code } });
    if (!discount) throw new NotFoundException('Discount code not found');
    return discount;
  }

  async create(dto: CreateDiscountDto) {
    return this.prisma.discount.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateDiscountDto>) {
    await this.findOne(id);
    return this.prisma.discount.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.discount.delete({ where: { id } });
  }
}
