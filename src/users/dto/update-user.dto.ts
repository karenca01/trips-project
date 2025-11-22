import {
	IsString,
	Length,
	IsEmail,
	MinLength,
	IsBoolean,
	IsOptional,
} from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@Length(1, 100)
	userName?: string;

	@IsOptional()
	@IsEmail()
	@Length(5, 100)
	userEmail?: string;

	@IsOptional()
	@IsString()
	@MinLength(8)
	@Length(8, 256)
	userPassword?: string;

	@IsOptional()
	@IsString()
	@Length(1, 100)
	userDocument?: string;

	@IsOptional()
	@IsBoolean()
	userVerified?: boolean;
}
