import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BusseatsService } from './busseats.service';
import { CreateBusseatDto } from './dto/create-busseat.dto';
import { UpdateBusseatDto } from './dto/update-busseat.dto';

@Controller('busseats')
export class BusseatsController {
  constructor(private readonly busseatsService: BusseatsService) {}

  @Post()
  create(@Body() createBusseatDto: CreateBusseatDto) {
    return this.busseatsService.create(createBusseatDto);
  }

  @Get()
  findAll() {
    return this.busseatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.busseatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusseatDto: UpdateBusseatDto) {
    return this.busseatsService.update(+id, updateBusseatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.busseatsService.remove(+id);
  }
}
