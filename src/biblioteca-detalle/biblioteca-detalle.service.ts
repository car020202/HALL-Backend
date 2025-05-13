import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BibliotecaDetalleService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async create(params: { id_key: number; id_biblioteca: number }) {
    const { id_key, id_biblioteca } = params;
    return this.prisma.biblioteca_detalle.create({
      data: {
        id_key,
        id_biblioteca,
      },
    });
  }

  // READ ALL
  async findAll() {
    return this.prisma.biblioteca_detalle.findMany();
  }

  // READ ONE
  async findOne(id: number) {
    const detalle = await this.prisma.biblioteca_detalle.findUnique({
      where: { id_biblioteca_detalle: id },
    });
    if (!detalle) throw new NotFoundException(`Detalle #${id} no existe`);
    return detalle;
  }

  // UPDATE
  async update(
    id: number,
    params: Partial<{ id_key: number; id_biblioteca: number }>,
  ) {
    await this.findOne(id);
    return this.prisma.biblioteca_detalle.update({
      where: { id_biblioteca_detalle: id },
      data: params,
    });
  }

  // DELETE
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.biblioteca_detalle.delete({
      where: { id_biblioteca_detalle: id },
    });
  }
}
