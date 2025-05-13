import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BibliotecaDetalleService } from './biblioteca-detalle.service';

@Controller('biblioteca-detalle')
export class BibliotecaDetalleController {
  constructor(private readonly detalleService: BibliotecaDetalleService) {}

  @Post()
  create(
    @Body('id_key', ParseIntPipe) id_key: number,
    @Body('id_biblioteca', ParseIntPipe) id_biblioteca: number,
  ) {
    return this.detalleService.create({ id_key, id_biblioteca });
  }

  @Get()
  findAll() {
    return this.detalleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detalleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<{ id_key: number; id_biblioteca: number }>,
  ) {
    return this.detalleService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.detalleService.remove(id);
  }
}
