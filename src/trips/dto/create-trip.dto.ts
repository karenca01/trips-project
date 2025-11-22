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
	routeId: string; 

	@IsUUID()
	busId: string; 

	@IsDateString()
	tripDate: string; 

	tripTime: string; 

	@Type(() => Number)
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@IsPositive()
	tripPrice: number; 
}
