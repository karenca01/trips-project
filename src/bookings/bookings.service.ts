import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { Tripseat } from 'src/tripseats/entities/tripseat.entity';
import { User } from 'src/auth/entities/user.entity';
import { TripSeatStatus } from 'src/tripseats/entities/tripseat.entity';
import { DataSource } from 'typeorm';


@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Tripseat)
    private readonly tripseatRepository: Repository<Tripseat>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ){}
  /**
   * Creates a booking and marks the trip seat as BOOKED within a DB transaction.
   * Ensures atomicity to avoid race conditions.
   */
  async create(createBookingDto: CreateBookingDto) {
    const { userId, tripSeatId } = createBookingDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, { where: { userId } });
      if (!user) throw new NotFoundException(`User ${userId} not found`);

      const tripSeat = await queryRunner.manager.findOne(Tripseat, { where: { tripSeatId }, relations: ['reservedBy'] });
      if (!tripSeat) throw new NotFoundException(`Seat ${tripSeatId} not found`);

      // If already booked -> conflict
      if (tripSeat.status === TripSeatStatus.BOOKED) {
        throw new ConflictException(`Seat ${tripSeatId} is already booked`);
      }

      // If reserved, only allow booking by the reserver within TTL (5 minutes)
      if (tripSeat.status === TripSeatStatus.RESERVED) {
        const reservedAt = tripSeat.reservedAt ? new Date(tripSeat.reservedAt) : null;
        const now = new Date();
        const expired = !reservedAt || now.getTime() - reservedAt.getTime() > 5 * 60 * 1000;
        if (expired) {
          throw new ConflictException(`Reservation for seat ${tripSeatId} has expired`);
        }

        const reserverId = tripSeat.reservedBy ? tripSeat.reservedBy.userId : null;
        if (reserverId !== userId) {
          throw new ConflictException(`Seat ${tripSeatId} is reserved by another user`);
        }
      }

      const bookingRepo = queryRunner.manager.getRepository(Booking);
      const tripseatRepo = queryRunner.manager.getRepository(Tripseat);

      const booking = bookingRepo.create({ tripSeatId, userId });
      const savedBooking = await bookingRepo.save(booking);

      tripSeat.status = TripSeatStatus.BOOKED;
      await tripseatRepo.save(tripSeat);

      await queryRunner.commitTransaction();

      // Return the saved booking including relations so the caller can see
      // the trip seat with its updated status immediately.
      const fullBooking = await bookingRepo.findOne({
        where: { bookingId: savedBooking.bookingId },
        relations: ['tripSeat', 'user'],
      });

      return fullBooking || savedBooking;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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