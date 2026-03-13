import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('menu')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Get all menu items' })
  findAll(@Query('category') category?: string, @Query('active') active?: string) {
    return this.menuService.findAll(category, active !== undefined ? active === 'true' : undefined);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  getCategories() {
    return this.menuService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu item by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.menuService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create menu item' })
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuService.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update menu item' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateMenuItemDto>) {
    return this.menuService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Delete menu item' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.menuService.remove(id);
  }
}
