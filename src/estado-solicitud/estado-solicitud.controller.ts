import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { EstadoSolicitudService } from './estado-solicitud.service';

@Controller('estado-solicitud')
export class EstadoSolicitudController {
  constructor(private readonly svc: EstadoSolicitudService) {}

  @Post()
  create(@Body('nombre') nombre: string) {
    return this.svc.create({ nombre });
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
  ) {
    return this.svc.update(id, { nombre });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
