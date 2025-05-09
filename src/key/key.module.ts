import { Module } from '@nestjs/common';
import { KeyService } from './key.service';
import { KeyController } from './key.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [KeyService, PrismaService],
  controllers: [KeyController],
})
export class KeyModule {}
