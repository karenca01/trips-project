import { IsUUID, IsString, Length, IsOptional } from 'class-validator';

export class UpdateBusseatDto {
	@IsOptional()
	@IsUUID()
	busId?: string;

	@IsOptional()
	@IsString()
	@Length(1, 10)
	seatNumber?: string;
}
