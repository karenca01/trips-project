import {
	IsString,
	Length,
	IsEmail,
	MinLength,
	IsBoolean,
	IsOptional,
} from 'class-validator';

export class CreateUserDto {
	@IsString()
	@Length(1, 100)
	userName: string;

	@IsEmail()
	@Length(5, 100)
	userEmail: string;

	@IsString()
	@MinLength(8)
	@Length(8, 256)
	userPassword: string; 

	@IsString()
	@Length(1, 100)
	userDocument: string;

	@IsOptional()
	@IsBoolean()
	userVerified?: boolean = false;
}
