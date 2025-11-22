import { IsUUID } from 'class-validator';

export class CreateBookingDto {
	@IsUUID()
	tripSeatId: string; 

	@IsUUID()
	userId: string; 
}
