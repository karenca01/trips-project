import { IsUUID, IsString, Length } from 'class-validator';

export class CreateBusseatDto {
	@IsUUID()
	busId: string; // FK to buses

	@IsString()
	@Length(1, 10)
	seatNumber: string;
}
