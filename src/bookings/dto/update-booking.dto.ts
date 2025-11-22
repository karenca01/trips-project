import { IsUUID, IsOptional } from 'class-validator';

export class UpdateBookingDto {
	@IsOptional()
	@IsUUID()
	tripSeatId?: string;

	@IsOptional()
	@IsUUID()
	userId?: string;
}
