import { IsString, Length } from 'class-validator';

export class CreateRouteDto {
	@IsString()
	@Length(1, 100)
	routeOrigin: string;

	@IsString()
	@Length(1, 100)
	routeDestination: string;
}
