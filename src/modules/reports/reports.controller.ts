import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('reports')
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.MANAGER)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @ApiOperation({ summary: 'Get sales summary report' })
  getSalesSummary(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.reportsService.getSalesSummary(startDate, endDate);
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory report' })
  getInventoryReport() {
    return this.reportsService.getInventoryReport();
  }

  @Get('employees')
  @ApiOperation({ summary: 'Get employee hours report' })
  getEmployeeReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.reportsService.getEmployeeReport(startDate, endDate);
  }

  @Get('kitchen')
  @ApiOperation({ summary: 'Get kitchen performance report' })
  getKitchenReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.reportsService.getKitchenReport(startDate, endDate);
  }
}
