import { Injectable } from '@nestjs/common';
import { CreateTripseatDto } from './dto/create-tripseat.dto';
import { UpdateTripseatDto } from './dto/update-tripseat.dto';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class TripseatsService {
  create(createTripseatDto: CreateTripseatDto) {
    return 'This action adds a new tripseat';
  }

  findAll() {
    return `This action returns all tripseats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tripseat`;
  }

  update(id: number, updateTripseatDto: UpdateTripseatDto) {
    return `This action updates a #${id} tripseat`;
  }

  remove(id: number) {
    return `This action removes a #${id} tripseat`;
  }
}
