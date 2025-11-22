import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripseatsService } from './tripseats.service';
import { TripseatsController } from './tripseats.controller';
import { Tripseat } from './entities/tripseat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tripseat])],
  controllers: [TripseatsController],
  providers: [TripseatsService],
})
export class TripseatsModule {}
