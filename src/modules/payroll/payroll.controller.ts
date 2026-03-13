import { Controller, Get, Post, Put, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('payroll')
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.MANAGER)
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get()
  @ApiOperation({ summary: 'Get all payroll records' })
  findAll(@Query('employeeId') employeeId?: string) {
    return this.payrollService.findAll(employeeId);
  }

  @Get('summary/:employeeId')
  @ApiOperation({ summary: 'Get payroll summary for employee' })
  getSummary(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.payrollService.getSummary(employeeId, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payroll record by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.payrollService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create payroll record' })
  create(@Body() dto: CreatePayrollDto) {
    return this.payrollService.create(dto);
  }

  @Put(':id/mark-paid')
  @ApiOperation({ summary: 'Mark payroll as paid' })
  markPaid(@Param('id', ParseUUIDPipe) id: string) {
    return this.payrollService.markPaid(id);
  }
}
