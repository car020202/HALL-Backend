import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AmistadService {
  constructor(private readonly prisma: PrismaService) {}

  async createAmistad(id_usuario_a: number, id_usuario_b: number) {
    return this.prisma.amistad.create({
      data: {
        id_usuario_a,
        id_usuario_b,
      },
    });
  }
}
