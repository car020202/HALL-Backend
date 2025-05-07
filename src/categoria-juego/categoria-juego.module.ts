import { Module } from '@nestjs/common';
import { CategoriaJuegoService } from './categoria-juego.service';
import { CategoriaJuegoController } from './categoria-juego.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CategoriaJuegoController],
  providers: [CategoriaJuegoService, PrismaService],
})
export class CategoriaJuegoModule {}
