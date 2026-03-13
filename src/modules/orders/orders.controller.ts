import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, ProcessPaymentDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  findAll(@Query('status') status?: string) {
    return this.ordersService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  create(@Body() dto: CreateOrderDto, @CurrentUser('id') employeeId: string) {
    return this.ordersService.create(dto, employeeId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Post(':id/payment')
  @ApiOperation({ summary: 'Process payment for order' })
  processPayment(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ProcessPaymentDto) {
    return this.ordersService.processPayment(id, dto);
  }

  @Put(':id/assign-chef/:chefId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Assign chef to order' })
  assignChef(@Param('id', ParseUUIDPipe) id: string, @Param('chefId', ParseUUIDPipe) chefId: string) {
    return this.ordersService.assignChef(id, chefId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Delete order' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.remove(id);
  }
}
