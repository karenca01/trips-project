import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TripseatsService } from './tripseats.service';
import { CreateTripseatDto } from './dto/create-tripseat.dto';
import { UpdateTripseatDto } from './dto/update-tripseat.dto';

@Controller('tripseats')
export class TripseatsController {
  constructor(
    private readonly tripseatsService: TripseatsService,
  ) {}
  @Post(':id/reserve')
  async reserveSeat(@Param('id') tripSeatId: string, @Body('userId') userId: string) {
    return this.tripseatsService.reserveSeat(tripSeatId, userId);
  }

  @Post()
  create(@Body() createTripseatDto: CreateTripseatDto) {
    return this.tripseatsService.create(createTripseatDto);
  }

  @Get()
  findAll() {
    return this.tripseatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripseatsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripseatDto: UpdateTripseatDto) {
    return this.tripseatsService.update(id, updateTripseatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripseatsService.remove(id);
  }
}
