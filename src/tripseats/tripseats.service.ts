import { Injectable } from '@nestjs/common';
import { CreateTripseatDto } from './dto/create-tripseat.dto';
import { UpdateTripseatDto } from './dto/update-tripseat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tripseat, TripSeatStatus } from './entities/tripseat.entity';
import { User } from '../auth/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TripseatsService {
  constructor(
    @InjectRepository(Tripseat) private tripseatRepository: Repository<Tripseat>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async create(createTripseatDto: CreateTripseatDto) {
    const tripseat = this.tripseatRepository.create(createTripseatDto);
    return this.tripseatRepository.save(tripseat);
  }

  async findAll() {
    //Liberamos asientos antes de retornar
    const seats = await this.tripseatRepository.find({
      relations : {
        trip: true,
        busSeat: true,
        reservedBy: true
      }
    });
    const now = new Date();
    //Se liberan los asientos que han estado en estado reservado por más de 5 minutos
    const expiredSeats = seats.filter(seat => seat.status === 'reserved' && seat.reservedAt && (now.getTime() - new Date(seat.reservedAt).getTime()) > 5 * 60 * 1000);
    for (const seat of expiredSeats) {
      seat.status = TripSeatStatus.FREE;
      seat.reservedAt = undefined;
      seat.reservedBy = undefined;
      await this.tripseatRepository.save(seat);
    }
    return await this.tripseatRepository.find({
      relations : {
        trip: true,
        busSeat: true,
        reservedBy: true
      }
    });
  }

  // Endpoint para reservar asiento
  async reserveSeat(tripSeatId: string, userId: string) {
    const seat = await this.tripseatRepository.findOne({
      where: { tripSeatId },
      relations: { reservedBy: true }
    });
    if (!seat) {
      throw new NotFoundException(`Tripseat with ID ${tripSeatId} not found`);
    }
    if (seat.status !== TripSeatStatus.FREE) {
      throw new NotFoundException(`Tripseat with ID ${tripSeatId} is not available for reservation`);
    }
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    seat.status = TripSeatStatus.RESERVED;
    seat.reservedAt = new Date();
    seat.reservedBy = user;
    return this.tripseatRepository.save(seat);
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
