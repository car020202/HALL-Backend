import { Module } from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { SuscripcionController } from './suscripcion.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SuscripcionController],
  providers: [SuscripcionService, PrismaService],
})
export class SuscripcionModule {}
