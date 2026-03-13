import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('discounts')
@ApiBearerAuth()
@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all discounts' })
  findAll(@Query('active') active?: string) {
    return this.discountsService.findAll(active !== undefined ? active === 'true' : undefined);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Find discount by code' })
  findByCode(@Param('code') code: string) {
    return this.discountsService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get discount by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.discountsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create discount' })
  create(@Body() dto: CreateDiscountDto) {
    return this.discountsService.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update discount' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateDiscountDto>) {
    return this.discountsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Delete discount' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.discountsService.remove(id);
  }
}
