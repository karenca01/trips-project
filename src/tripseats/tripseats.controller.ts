import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpCode, UnauthorizedException, ParseUUIDPipe } from '@nestjs/common';
import { TripseatsService } from './tripseats.service';
import { CreateTripseatDto } from './dto/create-tripseat.dto';
import { UpdateTripseatDto } from './dto/update-tripseat.dto';
import { BookingsService } from '../bookings/bookings.service';
import { AuthService } from '../auth/auth.service';
import type { Request } from 'express';
import { CreateBookingDto } from '../bookings/dto/create-booking.dto';

@Controller('tripseats')
export class TripseatsController {
  constructor(
    private readonly tripseatsService: TripseatsService,
    private readonly bookingsService: BookingsService,
    private readonly authService: AuthService,
  ) {}
  @Post(':id/reserve')
  @HttpCode(201)
  async reserveSeat(@Param('id', new ParseUUIDPipe()) tripSeatId: string, @Body('userId') userId: string) {
    const seat = await this.tripseatsService.reserveSeat(tripSeatId, userId);

    // compute expiresAt based on reservedAt (TTL = 5 minutes)
    const reservedAtDate = seat.reservedAt ? new Date(seat.reservedAt) : null;
    const expiresAt = reservedAtDate ? new Date(reservedAtDate.getTime() + 5 * 60 * 1000) : null;

    // Top-level response required by frontend: reservationId and tripSeatId at top-level
    const response = {
      reservationId: seat.tripSeatId,
      tripSeatId: seat.tripSeatId,
      tripId: seat.tripId,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
      status: seat.status,
      reservedAt: seat.reservedAt ? new Date(seat.reservedAt).toISOString() : null,
    };

    return response;
  }

  @Post()
  create(@Body() createTripseatDto: CreateTripseatDto) {
    return this.tripseatsService.create(createTripseatDto);
  }

  @Get()
  findAll() {
    return this.tripseatsService.findAll();
  }

  @Get('trip/:tripId')
  findAllByTrip(@Param('tripId', new ParseUUIDPipe()) tripId: string) {
    return this.tripseatsService.findAllByTrip(tripId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tripseatsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateTripseatDto: UpdateTripseatDto) {
    return this.tripseatsService.update(id, updateTripseatDto);
  }

  /**
   * Confirm booking: supports sending userId in body OR using cookie/Authorization Bearer token.
   * Returns created Booking (201) or throws 409/404 accordingly.
   */
  @Post(':id/book')
  @HttpCode(201)
  async bookSeat(@Param('id', new ParseUUIDPipe()) tripSeatId: string, @Body('userId') bodyUserId: string, @Req() req: Request) {
    // Determine userId: prefer body, otherwise try cookie or Authorization header
    let userId = bodyUserId;
    if (!userId) {
      const token = req.cookies?.token || (req.headers.authorization ? String(req.headers.authorization).split(' ')[1] : null);
      if (!token) throw new UnauthorizedException('No userId provided and no auth token present');
      const user = await this.authService.getUserFromToken(token);
      if (!user) throw new UnauthorizedException('Invalid token');
      userId = user.userId;
    }

    const dto: CreateBookingDto = { tripSeatId, userId };
    return this.bookingsService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tripseatsService.remove(id);
  }
}
