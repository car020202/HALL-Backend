import { Module } from '@nestjs/common';
import { BibliotecaDetalleService } from './biblioteca-detalle.service';
import { BibliotecaDetalleController } from './biblioteca-detalle.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [BibliotecaDetalleController],
  providers: [BibliotecaDetalleService, PrismaService],
})
export class BibliotecaDetalleModule {}
