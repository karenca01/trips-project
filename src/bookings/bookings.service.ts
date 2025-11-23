import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {v4 as uuidv4} from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { Tripseat } from 'src/tripseats/entities/tripseat.entity';
import { User } from 'src/auth/entities/user.entity';
import { TripSeatStatus } from 'src/tripseats/entities/tripseat.entity';


@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Tripseat)
    private readonly tripseatRepository: Repository<Tripseat>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async create(createBookingDto: CreateBookingDto, userId: string, tripSeatId: string) {
    const user = await this.userRepository.findOneBy({userId});
    if(!user) throw new NotFoundException(`User ${userId} not found`);

    const tripSeat = await this.tripseatRepository.findOneBy({tripSeatId});
    if(!tripSeat) throw new NotFoundException(`Seat ${tripSeatId} not found`);

    if(tripSeat.status === TripSeatStatus.BOOKED){
      throw new Error(`Seat ${tripSeatId} is already booked`);
    }

    const booking = this.bookingRepository.create({tripSeatId, userId});
    const savedBooking = await this.bookingRepository.save(booking);

    tripSeat.status = TripSeatStatus.BOOKED;
    await this.tripseatRepository.save(tripSeat);

    return savedBooking;
  }


  findAll() {
    return this.bookingRepository.find({
      relations: ['tripSeat', 'user']
    });
  }

  async findOne(id: string) {
    const seat = await this.bookingRepository.findOne({ 
      where: { bookingId: id },
      relations: ['tripSeat', 'user']
    });

    if(!seat) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return seat;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.bookingRepository.findOne({
      where: { bookingId: id },
      relations: ['tripSeat'],
    });

    if(!booking) throw new NotFoundException(`Booking ${id} not found`);

    const {tripSeatId: newTripSeatId} = updateBookingDto;

    if(newTripSeatId && newTripSeatId !== booking.tripSeatId){
      if(booking.tripSeat){
        booking.tripSeat.status = TripSeatStatus.FREE;
        await this.tripseatRepository.save(booking.tripSeat);
      }

      const newTripSeat = await this.tripseatRepository.findOneBy({tripSeatId: newTripSeatId});
      if(!newTripSeat) throw new NotFoundException(`Seat ${newTripSeatId} not found`);
      if(newTripSeat.status === TripSeatStatus.BOOKED){
        throw new Error(`Seat ${newTripSeatId} is already booked`);
      }

      newTripSeat.status = TripSeatStatus.BOOKED;
      await this.tripseatRepository.save(newTripSeat);
    }

    const updatedBooking = await this.bookingRepository.preload({
      bookingId: id,
      ...updateBookingDto, 
    });

    if(!updatedBooking) throw new NotFoundException(`Booking ${id} could not be updated`);

    return this.bookingRepository.save(updatedBooking);
  }

  async remove(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { bookingId: id },
      relations: ['tripSeat'],
    });

    if(!booking) throw new NotFoundException(`Booking ${id} not found`);

    if(booking.tripSeat) {
      booking.tripSeat.status = TripSeatStatus.FREE;
      await this.tripseatRepository.save(booking.tripSeat);
    }

    await this.bookingRepository.delete({bookingId: id});

    return {
      message: `Booking ${id} deleted and seat ${booking.tripSeat.tripSeatId} is now free`
    };
  }
}