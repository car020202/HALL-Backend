import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlataformaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { nombre: string }) {
    return this.prisma.plataforma.create({ data });
  }

  async findAll() {
    return this.prisma.plataforma.findMany();
  }

  async findOne(id: number) {
    const plataforma = await this.prisma.plataforma.findUnique({
      where: { id_plataforma: id },
    });
    if (!plataforma) {
      throw new NotFoundException('Plataforma no encontrada');
    }
    return plataforma;
  }

  async update(id: number, data: { nombre?: string }) {
    await this.findOne(id);
    return this.prisma.plataforma.update({
      where: { id_plataforma: id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.plataforma.delete({
      where: { id_plataforma: id },
    });
    return { message: 'Plataforma eliminada correctamente' };
  }
}
