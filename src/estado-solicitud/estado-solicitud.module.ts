import { Module } from '@nestjs/common';
import { EstadoSolicitudService } from './estado-solicitud.service';
import { EstadoSolicitudController } from './estado-solicitud.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [EstadoSolicitudController],
  providers: [EstadoSolicitudService, PrismaService],
})
export class EstadoSolicitudModule {}
