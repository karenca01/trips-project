import { IsString, Length , IsOptional} from 'class-validator';

export class CreateRouteDto {
	@IsString()
	@Length(1, 100)
	routeOrigin: string;

	@IsString()
	@Length(1, 100)
	routeDestination: string;

	@IsOptional()
	@IsString()
	@Length(1, 1024)
	image?: string;
}
