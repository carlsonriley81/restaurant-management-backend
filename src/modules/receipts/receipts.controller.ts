import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReceiptsService } from './receipts.service';

@ApiTags('receipts')
@ApiBearerAuth()
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all receipts' })
  findAll() {
    return this.receiptsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get receipt by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.receiptsService.findOne(id);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get receipt by order ID' })
  findByOrder(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return this.receiptsService.findByOrder(orderId);
  }
}
