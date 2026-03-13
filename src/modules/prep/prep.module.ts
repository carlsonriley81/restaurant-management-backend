import { Module } from '@nestjs/common';
import { PrepService } from './prep.service';
import { PrepController } from './prep.controller';

@Module({
  controllers: [PrepController],
  providers: [PrepService],
  exports: [PrepService],
})
export class PrepModule {}
