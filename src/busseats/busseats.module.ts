import { Module } from '@nestjs/common';
import { BusseatsService } from './busseats.service';
import { BusseatsController } from './busseats.controller';

@Module({
  controllers: [BusseatsController],
  providers: [BusseatsService],
})
export class BusseatsModule {}
