import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/create-employee.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll(role?: string) {
    return this.prisma.employee.findMany({
      where: role ? { role: role as any } : {},
      select: {
        id: true, firstName: true, lastName: true, email: true,
        role: true, hourlyWage: true, status: true, hireDate: true,
        contactInfo: true, emergencyContact: true,
      },
      orderBy: { lastName: 'asc' },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      select: {
        id: true, firstName: true, lastName: true, email: true,
        role: true, hourlyWage: true, status: true, hireDate: true,
        contactInfo: true, emergencyContact: true, createdAt: true,
        shifts: { orderBy: { startTime: 'desc' }, take: 10 },
      },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async create(dto: CreateEmployeeDto) {
    const existing = await this.prisma.employee.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    return this.prisma.employee.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        passwordHash,
        role: dto.role,
        hourlyWage: dto.hourlyWage,
        contactInfo: dto.contactInfo,
        emergencyContact: dto.emergencyContact,
      },
      select: {
        id: true, firstName: true, lastName: true, email: true,
        role: true, hourlyWage: true, status: true, hireDate: true,
      },
    });
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    await this.findOne(id);
    return this.prisma.employee.update({
      where: { id },
      data: dto,
      select: {
        id: true, firstName: true, lastName: true, email: true,
        role: true, hourlyWage: true, status: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.employee.delete({ where: { id } });
  }

  async clockIn(employeeId: string) {
    return this.prisma.shift.create({
      data: { employeeId, startTime: new Date() },
    });
  }

  async clockOut(shiftId: string) {
    const shift = await this.prisma.shift.findUnique({ where: { id: shiftId } });
    if (!shift) throw new NotFoundException('Shift not found');
    const endTime = new Date();
    const hoursWorked = (endTime.getTime() - shift.startTime.getTime()) / (1000 * 60 * 60);
    return this.prisma.shift.update({
      where: { id: shiftId },
      data: { endTime, hoursWorked },
    });
  }
}
