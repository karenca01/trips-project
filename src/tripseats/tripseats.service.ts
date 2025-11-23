import { Injectable } from '@nestjs/common';
import { CreateTripseatDto } from './dto/create-tripseat.dto';
import { UpdateTripseatDto } from './dto/update-tripseat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tripseat } from './entities/tripseat.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TripseatsService {
  constructor(@InjectRepository(Tripseat) private tripseatRepository: Repository<Tripseat>) { }

  async create(createTripseatDto: CreateTripseatDto) {
    const tripseat = this.tripseatRepository.create(createTripseatDto);
    return this.tripseatRepository.save(tripseat);
  }

  async findAll() {
    return this.tripseatRepository.find({
      relations : {
        trip: true,
        busSeat: true
      }
    });
  }

  async findOne(id: string) {
    const tripseat = await this.tripseatRepository.findOne({
      where: { tripSeatId: id },
      relations : {
        trip: true,
        busSeat: true
      }
    });
    return tripseat;
  }

  async update(id: string, updateTripseatDto: UpdateTripseatDto) {
    const tripseat = await this.tripseatRepository.findOneBy({ tripSeatId: id });
    if (!tripseat) {
      throw new NotFoundException(`Tripseat with ID ${id} not found`);
    }
    Object.assign(tripseat, updateTripseatDto);
    return this.tripseatRepository.save(tripseat);
  }

  async remove(id: string) {
    const tripseat = await this.tripseatRepository.delete({ tripSeatId: id });
    if (tripseat.affected === 0) {
      throw new NotFoundException(`Tripseat with ID ${id} not found`);
    }
    return { message: `Tripseat with ID ${id} has been removed` };
  }
}
