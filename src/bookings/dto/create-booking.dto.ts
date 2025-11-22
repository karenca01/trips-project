import { IsUUID } from 'class-validator';

export class CreateBookingDto {
	@IsUUID()
	tripSeatId: string; // FK to trip seats

	@IsUUID()
	userId: string; // FK to users
}
