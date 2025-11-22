import { IsString, Length, IsOptional } from 'class-validator';

export class UpdateBusDto {
	@IsOptional()
	@IsString()
	@Length(1, 100)
	busName?: string;
}
