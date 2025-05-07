import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SolicitudService } from './solicitud.service';

@Controller('solicitud')
export class SolicitudController {
  constructor(private readonly svc: SolicitudService) {}

  @Post()
  createSolicitud(
    @Body('id_solicitante', ParseIntPipe) id_solicitante: number,
    @Body('id_receptor', ParseIntPipe) id_receptor: number,
  ) {
    return this.svc.createSolicitud(id_solicitante, id_receptor);
  }

  @Get('received/:id_receptor')
  getSolicitudes(@Param('id_receptor', ParseIntPipe) id_receptor: number) {
    return this.svc.getSolicitudesRecibidas(id_receptor);
  }

  @Patch('respond/:id_solicitud')
  respondSolicitud(
    @Param('id_solicitud', ParseIntPipe) id_solicitud: number,
    @Query('aceptar') aceptar: string,
  ) {
    return this.svc.respondSolicitud(id_solicitud, aceptar === 'true');
  }
}
