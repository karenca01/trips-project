import { IsUUID, IsEnum, IsOptional } from 'class-validator';

export enum TripSeatStatus {
	FREE = 'free',
	RESERVED = 'reserved',
	BOOKED = 'booked',
}

export class CreateTripseatDto {
	@IsUUID()
	tripId: string; // FK to trips

	@IsUUID()
	busSeatId: string; // FK to bus seats

	@IsOptional()
	@IsEnum(TripSeatStatus)
	status?: TripSeatStatus = TripSeatStatus.FREE;
}
