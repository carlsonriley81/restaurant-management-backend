import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrepService } from './prep.service';
import { CreatePrepLogDto } from './dto/create-prep-log.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('prep')
@ApiBearerAuth()
@Controller('prep')
export class PrepController {
  constructor(private readonly prepService: PrepService) {}

  @Get()
  @ApiOperation({ summary: 'Get all prep logs' })
  findAll() {
    return this.prepService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prep log by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.prepService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Create prep log' })
  create(@Body() dto: CreatePrepLogDto) {
    return this.prepService.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Update prep log' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreatePrepLogDto>) {
    return this.prepService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Delete prep log' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.prepService.remove(id);
  }
}
