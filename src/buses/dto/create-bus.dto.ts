import { IsString, Length } from 'class-validator';

export class CreateBusDto {
	@IsString()
	@Length(1, 100)
	busName: string;
}
