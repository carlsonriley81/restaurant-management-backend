import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TrucksService } from './trucks.service';
import { CreateTruckDto, ReceiveTruckItemDto } from './dto/create-truck.dto';
import { TruckStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

class UpdateTruckStatusDto {
  @ApiProperty({ enum: TruckStatus })
  @IsEnum(TruckStatus)
  status: TruckStatus;
}

@ApiTags('trucks')
@ApiBearerAuth()
@Controller('trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all trucks' })
  findAll(@Query('status') status?: string) {
    return this.trucksService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get truck by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trucksService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create truck delivery' })
  create(@Body() dto: CreateTruckDto) {
    return this.trucksService.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update truck' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateTruckDto>) {
    return this.trucksService.update(id, dto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update truck status' })
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTruckStatusDto) {
    return this.trucksService.updateStatus(id, dto.status);
  }

  @Post('receive-item')
  @ApiOperation({ summary: 'Mark truck item as received' })
  receiveItem(@Body() dto: ReceiveTruckItemDto) {
    return this.trucksService.receiveItem(dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Delete truck' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.trucksService.remove(id);
  }
}
