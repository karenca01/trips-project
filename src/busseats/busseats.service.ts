import { Injectable } from '@nestjs/common';
import { CreateBusseatDto } from './dto/create-busseat.dto';
import { UpdateBusseatDto } from './dto/update-busseat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Busseat } from './entities/busseat.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BusseatsService {
  constructor(@InjectRepository(Busseat) private busseatRepository: Repository<Busseat>) { }

  async create(createBusseatDto: CreateBusseatDto) {
    const busseat = this.busseatRepository.create(createBusseatDto);
    return this.busseatRepository.save(busseat);
  }

  async findAll() {
    return this.busseatRepository.find({
      relations: {
        bus: true
      }
    });
  }

  async findOne(id: string) {
    const busseat = await this.busseatRepository.findOne({
      where: { busSeatId: id },
      relations: {
        bus: true
      }
    });
    return busseat;
  }

  async update(id: string, updateBusseatDto: UpdateBusseatDto) {
    const busseat = await this.busseatRepository.findOneBy({ busSeatId: id });
    if (!busseat) {
      throw new NotFoundException(`Busseat with ID ${id} not found`);
    }
    Object.assign(busseat, updateBusseatDto);
    return this.busseatRepository.save(busseat);
  }


  async remove(id: string) {
    const busseat = await this.busseatRepository.delete({ busSeatId: id });
    if (busseat.affected === 0) {
      throw new NotFoundException(`Busseat with ID ${id} not found`);
    }
    return { message: `Busseat with ID ${id} has been removed` };
  }
}