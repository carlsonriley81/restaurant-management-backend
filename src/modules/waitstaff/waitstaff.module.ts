import { Module } from '@nestjs/common';
import { WaitstaffService } from './waitstaff.service';
import { WaitstaffController } from './waitstaff.controller';

@Module({
  controllers: [WaitstaffController],
  providers: [WaitstaffService],
  exports: [WaitstaffService],
})
export class WaitstaffModule {}
