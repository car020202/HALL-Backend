import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventoService } from './evento.service';

@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  // === ADMIN: Crear evento ===
  @Post()
  async crearEvento(
    @Body()
    data: {
      titulo: string;
      descripcion: string;
      fecha_inicio: Date;
      fecha_fin: Date;
      id_juego: number;
      cantidad: number;
      id_evento_estado: number; // por ejemplo, 1 para 'activo'
    },
  ) {
    return this.eventoService.crearEvento(data);
  }

  // === ADMIN: Editar evento ===
  @Patch(':id')
  async editarEvento(
    @Param('id', ParseIntPipe) id_evento: number,
    @Body()
    data: Partial<{
      titulo: string;
      descripcion: string;
      fecha_inicio: Date;
      fecha_fin: Date;
      id_evento_estado: number;
    }>,
  ) {
    return this.eventoService.editarEvento(id_evento, data);
  }

  // === ADMIN: Eliminar evento ===
  @Delete(':id')
  async eliminarEvento(@Param('id', ParseIntPipe) id_evento: number) {
    return this.eventoService.eliminarEvento(id_evento);
  }

  // === USUARIO: Listar eventos activos ===
  @Get()
  async listarEventos() {
    return this.eventoService.listarEventos();
  }

  // === USUARIO: Participar en evento y reclamar regalo ===
  @Post(':id/participar')
  @UseGuards(AuthGuard('jwt'))
  async participar(@Param('id', ParseIntPipe) id_evento: number, @Req() req) {
    return this.eventoService.participarEnEvento(
      id_evento,
      req.user.id_usuario,
    );
  }

  // === USUARIO: Historial de eventos ===
  @Get('historial')
  async historialEventos() {
    return this.eventoService.historialEventos();
  }
}
