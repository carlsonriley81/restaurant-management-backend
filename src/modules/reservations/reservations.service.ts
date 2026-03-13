import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string, date?: string) {
    const where: any = {};
    if (status) where.status = status as ReservationStatus;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      where.reservationTime = { gte: start, lt: end };
    }
    return this.prisma.reservation.findMany({
      where,
      include: { tables: { include: { table: true } } },
      orderBy: { reservationTime: 'asc' },
    });
  }

  async findOne(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { tables: { include: { table: true } } },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }

  async create(dto: CreateReservationDto) {
    const { tableIds, ...data } = dto;
    return this.prisma.reservation.create({
      data: {
        ...data,
        reservationTime: new Date(dto.reservationTime),
        ...(tableIds && {
          tables: { create: tableIds.map((tableId) => ({ tableId })) },
        }),
      },
      include: { tables: { include: { table: true } } },
    });
  }

  async update(id: string, dto: Partial<CreateReservationDto>) {
    await this.findOne(id);
    const { tableIds, ...data } = dto;
    return this.prisma.reservation.update({
      where: { id },
      data: {
        ...data,
        ...(data.reservationTime && { reservationTime: new Date(data.reservationTime) }),
      },
    });
  }

  async updateStatus(id: string, status: ReservationStatus) {
    await this.findOne(id);
    return this.prisma.reservation.update({ where: { id }, data: { status } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.reservation.delete({ where: { id } });
  }
}
