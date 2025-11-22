import { PartialType } from '@nestjs/mapped-types';
import { CreateTripseatDto } from './create-tripseat.dto';

export class UpdateTripseatDto extends PartialType(CreateTripseatDto) {}
