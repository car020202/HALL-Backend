import { Module } from '@nestjs/common';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaController } from './biblioteca.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [BibliotecaController],
  providers: [BibliotecaService, PrismaService],
})
export class BibliotecaModule {}
