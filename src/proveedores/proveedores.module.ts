// src/proveedores/proveedores.module.ts
import { Module } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [ProveedoresController],
  providers: [ProveedoresService, PrismaService],
})
export class ProveedoresModule {}
