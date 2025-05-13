// transaccion.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransaccionService } from './transaccion.service';
import { TransaccionController } from './transaccion.controller';

@Module({
  providers: [PrismaService, TransaccionService],
  controllers: [TransaccionController],
})
export class TransaccionModule {}
