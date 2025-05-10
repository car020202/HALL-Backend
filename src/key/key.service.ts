import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class KeyService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    id_juego: number;
    key: string;
    id_estado_key: number;
    id_proveedor: number;
    precio: number;
  }) {
    // Crear la nueva key
    const nuevaKey = await this.prisma.key.create({ data });

    // Contar todas las keys del juego
    const total = await this.prisma.key.count({
      where: { id_juego: data.id_juego },
    });

    // Contar solo las keys disponibles del juego
    const disponibles = await this.prisma.key.count({
      where: {
        id_juego: data.id_juego,
        estado_key: {
          nombre: { equals: 'disponible', mode: 'insensitive' },
        },
      },
    });

    // Actualizar el juego con los nuevos conteos
    await this.prisma.juego.update({
      where: { id_juego: data.id_juego },
      data: {
        cantidad: total,
        cantidad_disponible: disponibles,
      },
    });

    return nuevaKey;
  }

  async findAll() {
    return this.prisma.key.findMany({
      include: {
        juego: true,
        estado_key: true,
        proveedor: true,
      },
    });
  }

  async findOne(id_key: number) {
    const k = await this.prisma.key.findUnique({
      where: { id_key },
      include: {
        juego: true,
        estado_key: true,
        proveedor: true,
      },
    });

    if (!k) throw new NotFoundException('Key no encontrada');
    return k;
  }

  async update(
    id_key: number,
    data: {
      key?: string;
      id_estado_key?: number;
      id_proveedor?: number;
    },
  ) {
    await this.findOne(id_key);
    return this.prisma.key.update({
      where: { id_key },
      data,
    });
  }

  async delete(id_key: number) {
    const key = await this.prisma.key.findUnique({
      where: { id_key },
      select: {
        id_key: true,
        id_juego: true,
      },
    });

    if (!key) {
      throw new NotFoundException('Key no encontrada.');
    }

    // Eliminar la key
    await this.prisma.key.delete({
      where: { id_key },
    });

    // Recontar después de eliminar
    const total = await this.prisma.key.count({
      where: { id_juego: key.id_juego },
    });

    const disponibles = await this.prisma.key.count({
      where: {
        id_juego: key.id_juego,
        estado_key: {
          nombre: { equals: 'disponible', mode: 'insensitive' },
        },
      },
    });

    // Actualizar juego
    await this.prisma.juego.update({
      where: { id_juego: key.id_juego },
      data: {
        cantidad: total,
        cantidad_disponible: disponibles,
      },
    });

    return { message: 'Key eliminada y juego actualizado correctamente' };
  }
}
