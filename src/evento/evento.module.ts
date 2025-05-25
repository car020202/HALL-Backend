import { Module } from '@nestjs/common';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { JuegoModule } from '../juego/juego.module'; // <-- Importa el módulo de juegos

@Module({
  imports: [JuegoModule], // <-- Agrega aquí
  controllers: [EventoController],
  providers: [EventoService, PrismaService],
})
export class EventoModule {}
