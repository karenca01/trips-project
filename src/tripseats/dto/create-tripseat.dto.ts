import { IsUUID, IsEnum, IsOptional } from 'class-validator';

export enum TripSeatStatus {
	FREE = 'free',
	RESERVED = 'reserved',
	BOOKED = 'booked',
}

export class CreateTripseatDto {
	@IsUUID()
	tripId: string; 

	@IsUUID()
	busSeatId: string; 

	@IsOptional()
	@IsEnum(TripSeatStatus)
	status?: TripSeatStatus = TripSeatStatus.FREE;
}
