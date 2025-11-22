import { 
    IsEmail, 
    IsString, 
    Length, 
    MinLength 
} from 'class-validator';

export class LoginUserDto {
    @IsEmail()
    @Length(5, 100)
    userEmail: string;

    @IsString()
    @MinLength(8)
    @Length(8, 256)
    userPassword: string; 
}