import { Module } from '@nestjs/common';
import { JuegoService } from './juego.service';
import { JuegoController } from './juego.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [JuegoService, PrismaService],
  controllers: [JuegoController],
})
export class JuegoModule {}
