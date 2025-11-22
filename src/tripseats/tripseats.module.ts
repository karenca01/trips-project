import { Module } from '@nestjs/common';
import { TripseatsService } from './tripseats.service';
import { TripseatsController } from './tripseats.controller';

@Module({
  controllers: [TripseatsController],
  providers: [TripseatsService],
})
export class TripseatsModule {}
