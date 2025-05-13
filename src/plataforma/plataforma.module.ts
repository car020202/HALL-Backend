import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PlataformaService } from './plataforma.service';
import { PlataformaController } from './plataforma.controller';

@Module({
  controllers: [PlataformaController],
  providers: [PlataformaService, PrismaService],
})
export class PlataformaModule {}
