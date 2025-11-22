import { PartialType } from '@nestjs/mapped-types';
import { CreateBusseatDto } from './create-busseat.dto';

export class UpdateBusseatDto extends PartialType(CreateBusseatDto) {}
