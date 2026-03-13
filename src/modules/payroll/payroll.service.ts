import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async findAll(employeeId?: string) {
    return this.prisma.payroll.findMany({
      where: employeeId ? { employeeId } : {},
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
      orderBy: { periodStart: 'desc' },
    });
  }

  async findOne(id: string) {
    const payroll = await this.prisma.payroll.findUnique({
      where: { id },
      include: { employee: { select: { id: true, firstName: true, lastName: true } } },
    });
    if (!payroll) throw new NotFoundException('Payroll record not found');
    return payroll;
  }

  async create(dto: CreatePayrollDto) {
    const grossPay = dto.hoursWorked * dto.hourlyRate;
    const netPay = grossPay + (dto.tips || 0) - (dto.deductions || 0);
    return this.prisma.payroll.create({
      data: {
        employeeId: dto.employeeId,
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
        hoursWorked: dto.hoursWorked,
        hourlyRate: dto.hourlyRate,
        grossPay,
        tips: dto.tips || 0,
        deductions: dto.deductions || 0,
        netPay,
      },
    });
  }

  async markPaid(id: string) {
    await this.findOne(id);
    return this.prisma.payroll.update({ where: { id }, data: { paid: true } });
  }

  async getSummary(employeeId: string, startDate: string, endDate: string) {
    const records = await this.prisma.payroll.findMany({
      where: {
        employeeId,
        periodStart: { gte: new Date(startDate) },
        periodEnd: { lte: new Date(endDate) },
      },
    });
    return {
      totalHours: records.reduce((acc, r) => acc + Number(r.hoursWorked), 0),
      totalGross: records.reduce((acc, r) => acc + Number(r.grossPay), 0),
      totalTips: records.reduce((acc, r) => acc + Number(r.tips), 0),
      totalNet: records.reduce((acc, r) => acc + Number(r.netPay), 0),
      records,
    };
  }
}
