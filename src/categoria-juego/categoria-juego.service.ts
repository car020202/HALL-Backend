import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriaJuegoService {
  constructor(private prisma: PrismaService) {}

  async create(data: { nombre: string; descripcion: string }) {
    return this.prisma.categoria_juego.create({ data });
  }

  async findAll() {
    return this.prisma.categoria_juego.findMany();
  }

  async findOne(id: number) {
    const cat = await this.prisma.categoria_juego.findUnique({
      where: { id_categoria_juego: id },
    });
    if (!cat) throw new NotFoundException(`Categoría ${id} no encontrada`);
    return cat;
  }

  async update(id: number, data: { nombre?: string; descripcion?: string }) {
    await this.findOne(id);
    return this.prisma.categoria_juego.update({
      where: { id_categoria_juego: id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.categoria_juego.delete({
      where: { id_categoria_juego: id },
    });
  }
}
