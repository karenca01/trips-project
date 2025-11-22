import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoutesModule } from './routes/routes.module';
import { BusesModule } from './buses/buses.module';
import { TripsModule } from './trips/trips.module';
import { BusseatsModule } from './busseats/busseats.module';
import { TripseatsModule } from './tripseats/tripseats.module';
import { BookingsModule } from './bookings/bookings.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [RoutesModule, BusesModule, TripsModule, BusseatsModule, TripseatsModule, BookingsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
