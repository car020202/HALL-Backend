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
import { CategoriaJuegoService } from './categoria-juego.service';

@Controller('categoria-juego')
export class CategoriaJuegoController {
  constructor(private svc: CategoriaJuegoService) {}

  @Post()
  create(
    @Body('nombre') nombre: string,
    @Body('descripcion') descripcion: string,
  ) {
    return this.svc.create({ nombre, descripcion });
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('nombre') nombre?: string,
    @Body('descripcion') descripcion?: string,
  ) {
    return this.svc.update(id, { nombre, descripcion });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
