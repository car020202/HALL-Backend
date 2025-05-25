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
import { BibliotecaService } from './biblioteca.service';
import { RawgService } from '../juego/rawg.service';

@Controller('biblioteca')
export class BibliotecaController {
  constructor(
    private readonly bibliotecaService: BibliotecaService,
    private readonly rawgService: RawgService,
  ) {}

  @Post()
  create(@Body('id_usuario', ParseIntPipe) id_usuario: number) {
    return this.bibliotecaService.create({ id_usuario });
  }

  @Get()
  findAll() {
    return this.bibliotecaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bibliotecaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { id_usuario?: number },
  ) {
    return this.bibliotecaService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bibliotecaService.remove(id);
  }

  // GET /biblioteca/usuario/:id_usuario
  @Get('usuario/:id_usuario')
  async getBibliotecaUsuario(
    @Param('id_usuario', ParseIntPipe) id_usuario: number,
  ) {
    return this.bibliotecaService.getBibliotecaPorUsuario(id_usuario);
  }

  @Post('devolver-key')
  async devolverKey(
    @Body('id_usuario', ParseIntPipe) id_usuario: number,
    @Body('id_key', ParseIntPipe) id_key: number,
  ) {
    return this.bibliotecaService.devolverKey(id_usuario, id_key);
  }
}
