import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './entities/route.entity';

@Injectable()
export class RoutesService {
  constructor(@InjectRepository(Route) private routeRepository: Repository<Route>) { }

  async create(createRouteDto: CreateRouteDto) {
    const route = this.routeRepository.create(createRouteDto);
    return this.routeRepository.save(route);
  }

  async findAll() {
    return this.routeRepository.find();
  }

  async findOne(id: string) {
    const route = await this.routeRepository.findOneBy(
      {
        routeId: id
      }
    );
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    const route = await this.routeRepository.findOneBy({ routeId: id });
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    Object.assign(route, updateRouteDto);
    return this.routeRepository.save(route);
  }

  async remove(id: string) {
    const route = await this.routeRepository.delete({ routeId: id });
    if (route.affected === 0) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return { message: `Route with ID ${id} has been removed` };
  }
}
