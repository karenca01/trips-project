import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../aws/aws.service';
import type { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly awsService: AwsService) { }

  @Post('register')
  @UseInterceptors(FileInterceptor('document'))
  async register(@Body() dto: CreateUserDto, @UploadedFile() document?: any) {
    if (document) {
      const upload = await this.awsService.uploadFile(document);
      dto.userDocument = upload.url;
    }
    return this.authService.register(dto);
  }

  // @Post('login')
  // async login(@Body() loginUserDto: LoginUserDto) {
  //   const token = await this.authService.login(loginUserDto);
  //   console.log(token)
  //   return this.authService.login(loginUserDto);
  // }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(loginUserDto);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })

    return;
  }

  @Patch("/:id")
  @UseInterceptors(FileInterceptor('document'))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile() document?: any) {
    if (document) {
      const upload = await this.awsService.uploadFile(document);
      updateUserDto.userDocument = upload.url;
    }
    return this.authService.update(id, updateUserDto)
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Logout successful' };
  }
}
