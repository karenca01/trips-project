import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusseatsService } from './busseats.service';
import { BusseatsController } from './busseats.controller';
import { Busseat } from './entities/busseat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Busseat])],
  controllers: [BusseatsController],
  providers: [BusseatsService],
})
export class BusseatsModule {}
