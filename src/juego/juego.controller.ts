import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { JuegoService } from './juego.service';

@Controller('juego')
export class JuegoController {
  constructor(private readonly juegoService: JuegoService) {}

  @Post()
  create(
    @Body()
    data: {
      titulo: string;
      descripcion: string;
      id_categoria_juego: number;
      cantidad: number;
      cantidad_disponible: number;
    },
  ) {
    return this.juegoService.create(data);
  }

  @Get()
  findAll() {
    return this.juegoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.juegoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    data: {
      titulo?: string;
      descripcion?: string;
      id_categoria_juego?: number;
      cantidad?: number;
      cantidad_disponible?: number;
    },
  ) {
    return this.juegoService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.juegoService.remove(id);
  }
}
