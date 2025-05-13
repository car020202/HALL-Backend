import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BibliotecaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: { id_usuario: number }) {
    return this.prisma.biblioteca.create({
      data: { id_usuario: params.id_usuario },
    });
  }

  // biblioteca.service.ts
  async findAll() {
    return this.prisma.biblioteca.findMany({
      include: {
        biblioteca_detalle: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.biblioteca.findUnique({
      where: { id_biblioteca: id },
      include: {
        biblioteca_detalle: true,
      },
    });
  }

  async update(id: number, params: { id_usuario?: number }) {
    await this.findOne(id);
    return this.prisma.biblioteca.update({
      where: { id_biblioteca: id },
      data: params,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.biblioteca.delete({
      where: { id_biblioteca: id },
    });
  }
}
