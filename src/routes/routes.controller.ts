import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { AwsService } from '../aws/aws.service';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService, private readonly awsService: AwsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createRouteDto: CreateRouteDto, @UploadedFile() image?: Express.Multer.File) {
    if (image) {
      const upload = await this.awsService.uploadFile(image as any);
      createRouteDto.image = upload.url;
    }
    return this.routesService.create(createRouteDto);
  }

  @Get()
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto, @UploadedFile() image?: Express.Multer.File) {
    if (image) {
      const upload = await this.awsService.uploadFile(image as any);
      updateRouteDto.image = upload.url;
    }
    return this.routesService.update(id, updateRouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }
}
