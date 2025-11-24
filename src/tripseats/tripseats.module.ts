import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripseatsService } from './tripseats.service';
import { TripseatsController } from './tripseats.controller';
import { Tripseat } from './entities/tripseat.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tripseat, User])],
  controllers: [TripseatsController],
  providers: [TripseatsService],
})
export class TripseatsModule {}
