import {
	IsUUID,
	IsDateString,
	IsNumber,
	Min,
	IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTripDto {
	@IsUUID()
	routeId: string; // FK to routes

	@IsUUID()
	busId: string; // FK to buses

	@IsDateString()
	tripDate: string; // ISO date (YYYY-MM-DD)

	tripTime: string; // HH:MM or HH:MM:SS

	@Type(() => Number)
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@IsPositive()
	tripPrice: number; // decimal(10,2)
}
