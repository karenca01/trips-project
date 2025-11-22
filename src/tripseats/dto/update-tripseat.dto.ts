import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { TripSeatStatus } from './create-tripseat.dto';

export class UpdateTripseatDto {
	@IsOptional()
	@IsUUID()
	tripId?: string;

	@IsOptional()
	@IsUUID()
	busSeatId?: string;

	@IsOptional()
	@IsEnum(TripSeatStatus)
	status?: TripSeatStatus;
}
