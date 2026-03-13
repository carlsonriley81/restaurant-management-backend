import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTableDto, UpdateTableStatusDto } from './dto/create-table.dto';
import { EventsGateway } from '../../gateway/events.gateway';

@Injectable()
export class TablesService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async findAll() {
    return this.prisma.table.findMany({
      include: {
        server: { select: { id: true, firstName: true, lastName: true } },
        orders: { where: { orderStatus: { notIn: ['COMPLETED', 'CANCELLED'] } } },
      },
      orderBy: { tableNumber: 'asc' },
    });
  }

  async findOne(id: string) {
    const table = await this.prisma.table.findUnique({
      where: { id },
      include: {
        server: { select: { id: true, firstName: true, lastName: true } },
        orders: { include: { items: { include: { menuItem: true } } } },
      },
    });
    if (!table) throw new NotFoundException('Table not found');
    return table;
  }

  async create(dto: CreateTableDto) {
    return this.prisma.table.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateTableDto>) {
    await this.findOne(id);
    return this.prisma.table.update({ where: { id }, data: dto });
  }

  async updateStatus(id: string, dto: UpdateTableStatusDto) {
    await this.findOne(id);
    const table = await this.prisma.table.update({
      where: { id },
      data: { status: dto.status, serverId: dto.serverId },
    });
    this.eventsGateway.emitTableUpdate(id, { status: dto.status });
    return table;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.table.delete({ where: { id } });
  }
}
