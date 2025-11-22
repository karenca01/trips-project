import { IsString, Length, IsOptional } from 'class-validator';

export class UpdateRouteDto {
	@IsOptional()
	@IsString()
	@Length(1, 100)
	routeOrigin?: string;

	@IsOptional()
	@IsString()
	@Length(1, 100)
	routeDestination?: string;
}
