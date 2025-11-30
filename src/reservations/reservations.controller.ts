import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { TripseatsService } from '../tripseats/tripseats.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly tripseatsService: TripseatsService) {}

  @Get(':id')
  async getReservation(@Param('id') reservationId: string) {
    // In this implementation reservationId == tripSeatId
    const seat = await this.tripseatsService.findOne(reservationId);
    if (!seat) throw new NotFoundException(`Reservation ${reservationId} not found`);

    const reservedAtDate = seat.reservedAt ? new Date(seat.reservedAt) : null;
    const expiresAt = reservedAtDate ? new Date(reservedAtDate.getTime() + 5 * 60 * 1000) : null;

    return {
      reservationId: seat.tripSeatId,
      tripSeatId: seat.tripSeatId,
      tripId: seat.tripId,
      status: seat.status,
      reservedAt: seat.reservedAt ? new Date(seat.reservedAt).toISOString() : null,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
    };
  }
}
