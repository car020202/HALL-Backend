import { Module } from '@nestjs/common';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaController } from './biblioteca.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { JuegoModule } from '../juego/juego.module'; // importa el módulo de juegos

@Module({
  imports: [JuegoModule], // <-- agrega esto
  controllers: [BibliotecaController],
  providers: [BibliotecaService, PrismaService],
})
export class BibliotecaModule {}
