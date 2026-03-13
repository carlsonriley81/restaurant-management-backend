import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PosService } from './pos.service';

@ApiTags('pos')
@ApiBearerAuth()
@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get POS dashboard data' })
  getDashboard() {
    return this.posService.getDashboard();
  }

  @Get('active-orders')
  @ApiOperation({ summary: 'Get all active orders for POS' })
  getActiveOrders() {
    return this.posService.getActiveOrders();
  }
}
