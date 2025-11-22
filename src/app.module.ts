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
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
  TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: +(process.env.DB_PORT || 5432),
      username: 'postgres',
      password: process.env.PASS,
      database: process.env.NAME,
      entities: [],
      autoLoadEntities: true, 
      synchronize: true,
    }),
  RoutesModule, BusesModule, TripsModule, BusseatsModule, TripseatsModule, BookingsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
