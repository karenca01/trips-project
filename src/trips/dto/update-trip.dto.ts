import {
	IsUUID,
	IsDateString,
	Matches,
	IsNumber,
	Min,
	IsPositive,
	IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTripDto {
	@IsOptional()
	@IsUUID()
	routeId?: string;

	@IsOptional()
	@IsUUID()
	busId?: string;

	@IsOptional()
	@IsDateString()
	tripDate?: string;

	@IsOptional()
	@Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
	tripTime?: string;

	@IsOptional()
	@Type(() => Number)
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@IsPositive()
	tripPrice?: number;
}
