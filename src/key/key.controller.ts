import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { KeyService } from './key.service';

@Controller('key')
export class KeyController {
  constructor(private readonly keyService: KeyService) {}

  @Get('platforms/counts')
  countAllByPlatform() {
    return this.keyService.countAllByPlatform();
  }

  @Get('platform/:id')
  findByPlatform(@Param('id', ParseIntPipe) id_plataforma: number) {
    return this.keyService.findByPlatform(id_plataforma);
  }

  @Post()
  create(
    @Body('id_juego') id_juego: number,
    @Body('key') key: string,
    @Body('id_estado_key') id_estado_key: number,
    @Body('id_proveedor') id_proveedor: number,
    @Body('id_plataforma') id_plataforma: number,
    @Body('precio') precio: number,
  ) {
    return this.keyService.create({
      id_juego,
      key,
      id_estado_key,
      id_proveedor,
      id_plataforma,
      precio,
    });
  }

  @Get()
  findAll() {
    return this.keyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.keyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    data: {
      key?: string;
      id_estado_key?: number;
      id_proveedor?: number;
      id_plataforma?: number;
    },
  ) {
    return this.keyService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.keyService.delete(id);
  }
}
