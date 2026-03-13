import { Controller, Get, Put, Param, Query, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KitchenService } from './kitchen.service';
import { KitchenTicketStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateTicketStatusDto {
  @ApiProperty({ enum: KitchenTicketStatus })
  @IsEnum(KitchenTicketStatus)
  status: KitchenTicketStatus;
}

@ApiTags('kitchen')
@ApiBearerAuth()
@Controller('kitchen')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get('tickets')
  @ApiOperation({ summary: 'Get all kitchen tickets' })
  findAllTickets(@Query('status') status?: string) {
    return this.kitchenService.findAllTickets(status);
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get kitchen ticket by ID' })
  findTicket(@Param('id', ParseUUIDPipe) id: string) {
    return this.kitchenService.findTicket(id);
  }

  @Put('tickets/:id/status')
  @ApiOperation({ summary: 'Update kitchen ticket status' })
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTicketStatusDto) {
    return this.kitchenService.updateTicketStatus(id, dto.status);
  }

  @Get('prep-logs')
  @ApiOperation({ summary: 'Get prep logs' })
  getPrepLogs() {
    return this.kitchenService.getActivePrepLogs();
  }
}
