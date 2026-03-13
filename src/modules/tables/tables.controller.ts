import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { CreateTableDto, UpdateTableStatusDto } from './dto/create-table.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('tables')
@ApiBearerAuth()
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tables' })
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get table by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tablesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create table' })
  create(@Body() dto: CreateTableDto) {
    return this.tablesService.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update table' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateTableDto>) {
    return this.tablesService.update(id, dto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update table status' })
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTableStatusDto) {
    return this.tablesService.updateStatus(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Delete table' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tablesService.remove(id);
  }
}
