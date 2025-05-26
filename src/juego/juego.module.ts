// src/juego/juego.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { JuegoService } from './juego.service';
import { JuegoController } from './juego.controller';
import { PrismaService } from '../../prisma/prisma.service';

import { RawgService } from './rawg.service';
import { RawgController } from './rawg.controller';

@Module({
  imports: [
    HttpModule, // para peticiones a RAWG
    ConfigModule, //ConfigModule global
  ],
  providers: [
    JuegoService,
    PrismaService,
    RawgService, // servicio RAWG
  ],
  controllers: [
    JuegoController,
    RawgController, // expone /juegos
  ],
  exports: [RawgService, JuegoService],
})
export class JuegoModule {}
