import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripseatsService } from './tripseats.service';
import { TripseatsController } from './tripseats.controller';
import { ReservationsController } from '../reservations/reservations.controller';
import { Tripseat } from './entities/tripseat.entity';
import { User } from '../auth/entities/user.entity';
import { BookingsModule } from '../bookings/bookings.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tripseat, User]), BookingsModule, AuthModule],
  controllers: [TripseatsController, ReservationsController],
  providers: [TripseatsService],
})
export class TripseatsModule {}
