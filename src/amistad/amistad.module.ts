import { Module } from '@nestjs/common';
import { AmistadService } from './amistad.service';
import { AmistadController } from './amistad.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AmistadController],
  providers: [AmistadService, PrismaService],
})
export class AmistadModule {}
