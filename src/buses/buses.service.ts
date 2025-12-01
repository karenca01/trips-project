import { Injectable } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bus } from './entities/bus.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BusesService {
  constructor (@InjectRepository(Bus) private busRepository: Repository<Bus>) {}

  async create(createBusDto: CreateBusDto) {
    const bus = this.busRepository.create(createBusDto);
    return this.busRepository.save(bus);
  }

  async findAll() {
    return this.busRepository.find({
      relations: ['trips']
    });
  }

  async findOne(id: string) {
    const bus = await  this.busRepository.findOneBy(
      { 
        busId: id 
      }
    );
    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }
    return bus;
  }

  async update(id: string, updateBusDto: UpdateBusDto) {
    const bus = await this.busRepository.findOneBy({ busId: id });
    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }
    Object.assign(bus, updateBusDto);
    return this.busRepository.save(bus);
  }

  async remove(id: string) {
    const bus = await this.busRepository.delete({ busId: id });
    if (bus.affected === 0) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }
    return { message: `Bus with ID ${id} has been removed` };
  }
}
