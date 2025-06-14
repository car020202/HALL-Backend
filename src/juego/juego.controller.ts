import {
  Controller,
  Get,
  Query,
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

  @Get('buscar')
  async buscarJuegos(@Query('query') query: string) {
    const juegos = await this.juegoService.buscarPorTitulo(query);
    return juegos;
  }

  // GET /juego - solo datos DB
  @Get()
  getAll() {
    return this.juegoService.findAll();
  }

  // GET /juego/con-portadas - datos DB + portada
  @Get('con-portadas')
  getAllWithPortadas() {
    return this.juegoService.findAllWithPortadas();
  }

  // GET /juego/plataforma/:id/con-portadas
  @Get('plataforma/:id/con-portadas')
  getByPlataformaWithPortadas(@Param('id', ParseIntPipe) id: number) {
    return this.juegoService.findByPlataformaWithPortadas(id);
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
