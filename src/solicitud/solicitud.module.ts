import { Module } from '@nestjs/common';
import { SolicitudService } from './solicitud.service';
import { SolicitudController } from './solicitud.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AmistadService } from '../amistad/amistad.service';

@Module({
  controllers: [SolicitudController],
  providers: [SolicitudService, PrismaService, AmistadService],
})
export class SolicitudModule {}
