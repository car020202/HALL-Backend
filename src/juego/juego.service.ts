import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JuegoService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    titulo: string;
    descripcion: string;
    id_categoria_juego: number;
    cantidad: number;
    cantidad_disponible: number;
  }) {
    return this.prisma.juego.create({ data });
  }

  async findAll() {
    return this.prisma.juego.findMany({
      include: { categoria: true },
    });
  }

  async findOne(id_juego: number) {
    const juego = await this.prisma.juego.findUnique({
      where: { id_juego },
      include: { categoria: true },
    });

    if (!juego) {
      throw new NotFoundException(`Juego con ID ${id_juego} no encontrado.`);
    }

    return juego;
  }

  async update(
    id_juego: number,
    data: {
      titulo?: string;
      descripcion?: string;
      id_categoria_juego?: number;
      cantidad?: number;
      cantidad_disponible?: number;
    },
  ) {
    await this.findOne(id_juego); // Valida si existe el juego
    return this.prisma.juego.update({ where: { id_juego }, data });
  }

  async remove(id_juego: number) {
    await this.findOne(id_juego); // Valida si existe el juego
    return this.prisma.juego.delete({ where: { id_juego } });
  }
}
