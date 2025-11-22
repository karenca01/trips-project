import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {  UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ){}

  async register(createUserDto: CreateUserDto){
    const hashedPassword = await bcrypt.hash(createUserDto.userPassword, 10);
    const user = await this.userRepository.save({
      ...createUserDto,
      userPassword: hashedPassword,
    })
    return user;
  }

  async login(loginUserDto: LoginUserDto){
    const user = await this.userRepository.findOne({
      where: { userEmail: loginUserDto.userEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const match = await bcrypt.compare(loginUserDto.userPassword, user.userPassword);
    if (!match) throw new UnauthorizedException('Datos incorrectos');

    const payload = {
      userEmail: user.userEmail,
    };

    const token = this.jwtService.sign(payload);
    return token;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.userPassword) {
      updateUserDto.userPassword = bcrypt.hashSync(updateUserDto.userPassword, 5);
    }
    const newUserData = await this.userRepository.preload({
      userId: id,
      ...updateUserDto
    })
    if(!newUserData) throw new NotFoundException('Usuario no encontrado');

    this.userRepository.save(newUserData)
    return newUserData;
  }
}
