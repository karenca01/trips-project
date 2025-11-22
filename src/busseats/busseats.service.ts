import { Injectable } from '@nestjs/common';
import { CreateBusseatDto } from './dto/create-busseat.dto';
import { UpdateBusseatDto } from './dto/update-busseat.dto';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class BusseatsService {
  create(createBusseatDto: CreateBusseatDto) {
    return 'This action adds a new busseat';
  }

  findAll() {
    return `This action returns all busseats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} busseat`;
  }

  update(id: number, updateBusseatDto: UpdateBusseatDto) {
    return `This action updates a #${id} busseat`;
  }

  remove(id: number) {
    return `This action removes a #${id} busseat`;
  }
}
