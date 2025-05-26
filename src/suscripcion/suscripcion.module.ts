import { Module } from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { SuscripcionController } from './suscripcion.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { JuegoService } from '../juego/juego.service';
import { JuegoModule } from 'src/juego/juego.module';

@Module({
  imports: [JuegoModule],
  controllers: [SuscripcionController],
  providers: [SuscripcionService, PrismaService],
})
export class SuscripcionModule {}
