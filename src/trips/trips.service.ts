import { Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TripsService {
  constructor(@InjectRepository(Trip) private tripRepository: Repository<Trip>) { }

  async create(createTripDto: CreateTripDto) {
    const trip = this.tripRepository.create(createTripDto);
    return this.tripRepository.save(trip);
  }

  async findByRoute(routeId: string) {
    return this.tripRepository.find({
      where: { route: { routeId } },
      relations: {
        route: true,
        bus: true,
      },
    });
  }

  async findAll() {
    return this.tripRepository.find({
      relations: {
        route: true,
        bus: true
      }
    });
  }

  async findOne(id: string) {
    const trip = await this.tripRepository.findOne({
      where: { tripId: id },
      relations: {
        route: true,
        bus: true
      }
    });
    return trip;
  }

  async searchTrips(filters: any) {
    const { date, origin, destination } = filters;

    const where: any = {};

    if (date) where.tripDate = date;
    if (origin) where.route = { routeOrigin: origin };
    if (destination) where.route = { ...where.route, routeDestination: destination };

    return this.tripRepository.find({
      where,
      relations: ['route'],
    });
  }

  async update(id: string, updateTripDto: UpdateTripDto) {
    const trip = await this.tripRepository.findOneBy({ tripId: id });
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    Object.assign(trip, updateTripDto);
    return this.tripRepository.save(trip);
  }


  async remove(id: string) {
    const trip = await this.tripRepository.delete({ tripId: id });
    if (trip.affected === 0) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    return { message: `Trip with ID ${id} has been removed` };
  }
}
