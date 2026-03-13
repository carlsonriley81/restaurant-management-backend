import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WaitstaffService } from './waitstaff.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('waitstaff')
@ApiBearerAuth()
@Roles(Role.SERVER, Role.ADMIN, Role.MANAGER)
@Controller('waitstaff')
export class WaitstaffController {
  constructor(private readonly waitstaffService: WaitstaffService) {}

  @Get('my-tables')
  @ApiOperation({ summary: 'Get tables assigned to current server' })
  getMyTables(@CurrentUser('id') serverId: string) {
    return this.waitstaffService.getMyTables(serverId);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Get active orders for current server' })
  getMyOrders(@CurrentUser('id') serverId: string) {
    return this.waitstaffService.getMyOrders(serverId);
  }

  @Get('my-stats')
  @ApiOperation({ summary: 'Get stats for current server' })
  getMyStats(@CurrentUser('id') serverId: string) {
    return this.waitstaffService.getMyStats(serverId);
  }
}
