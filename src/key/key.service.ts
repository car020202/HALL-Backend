import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';

@Injectable()
export class KeyService {
  constructor(private readonly prisma: PrismaService) {}

  /** Conteo total de keys por plataforma */
  async countAllByPlatform() {
    const groups = await this.prisma.key.groupBy({
      by: ['id_plataforma'],
      _count: { id_key: true },
    });
    return groups.map((g) => ({
      id_plataforma: g.id_plataforma,
      count: g._count.id_key,
    }));
  }

  /** Listar keys para una plataforma, incluyendo relaciones y precios */
  async findByPlatform(id_plataforma: number) {
    return this.prisma.key.findMany({
      where: { id_plataforma },
      include: {
        juego: true,
        estado_key: true,
        proveedor: true,
        plataforma: true,
      },
    });
  }

  /** Crear una nueva key (compra), registrando precio_compra y precio_venta */
  async create(data: {
    id_juego: number;
    key: string;
    id_estado_key: number;
    id_proveedor: number;
    id_plataforma: number;
    precioCompra: number;
    precioVenta: number;
  }) {
    const {
      id_juego,
      key,
      id_estado_key,
      id_proveedor,
      id_plataforma,
      precioCompra,
      precioVenta,
    } = data;

    const nuevaKey = await this.prisma.key.create({
      data: {
        id_juego,
        key,
        id_estado_key,
        id_proveedor,
        id_plataforma,
        precio_compra: precioCompra,
        precio_venta: precioVenta,
      },
    });

    // Recalcular contadores en juego
    const total = await this.prisma.key.count({ where: { id_juego } });
    const disponibles = await this.prisma.key.count({
      where: {
        id_juego,
        estado_key: { nombre: { equals: 'disponible', mode: 'insensitive' } },
      },
    });
    await this.prisma.juego.update({
      where: { id_juego },
      data: {
        cantidad: total,
        cantidad_disponible: disponibles,
      },
    });

    return nuevaKey;
  }

  /** Listar todas las keys */
  async findAll() {
    return this.prisma.key.findMany({
      include: {
        juego: true,
        estado_key: true,
        proveedor: true,
        plataforma: true,
      },
    });
  }

  /** Obtener una key */
  async findOne(id_key: number) {
    const k = await this.prisma.key.findUnique({
      where: { id_key },
      include: {
        juego: true,
        estado_key: true,
        proveedor: true,
        plataforma: true,
      },
    });
    if (!k) throw new NotFoundException('Key no encontrada');
    return k;
  }

  /** Actualizar campos de una key, incluyendo precios si se requieren */
  async update(
    id_key: number,
    data: {
      key?: string;
      id_estado_key?: number;
      id_proveedor?: number;
      id_plataforma?: number;
      precioCompra?: number;
      precioVenta?: number;
    },
  ) {
    // verifica existencia
    await this.findOne(id_key);

    // mapea a los nombres de columnas correctos
    const payload: any = {};
    if (data.key !== undefined) payload.key = data.key;
    if (data.id_estado_key !== undefined)
      payload.id_estado_key = data.id_estado_key;
    if (data.id_proveedor !== undefined)
      payload.id_proveedor = data.id_proveedor;
    if (data.id_plataforma !== undefined)
      payload.id_plataforma = data.id_plataforma;
    if (data.precioCompra !== undefined)
      payload.precio_compra = data.precioCompra;
    if (data.precioVenta !== undefined) payload.precio_venta = data.precioVenta;

    const updated = await this.prisma.key.update({
      where: { id_key },
      data: payload,
    });

    // Recalcula contadores en el juego asociado
    const total = await this.prisma.key.count({
      where: { id_juego: updated.id_juego },
    });
    const disponibles = await this.prisma.key.count({
      where: {
        id_juego: updated.id_juego,
        estado_key: { nombre: { equals: 'disponible', mode: 'insensitive' } },
      },
    });
    await this.prisma.juego.update({
      where: { id_juego: updated.id_juego },
      data: {
        cantidad: total,
        cantidad_disponible: disponibles,
      },
    });

    return updated;
  }

  /** Eliminar una key */
  async delete(id_key: number) {
    const key = await this.prisma.key.findUnique({
      where: { id_key },
      select: { id_key: true, id_juego: true },
    });
    if (!key) throw new NotFoundException('Key no encontrada');

    await this.prisma.key.delete({ where: { id_key } });

    // Recalcula contadores
    const total = await this.prisma.key.count({
      where: { id_juego: key.id_juego },
    });
    const disponibles = await this.prisma.key.count({
      where: {
        id_juego: key.id_juego,
        estado_key: { nombre: { equals: 'disponible', mode: 'insensitive' } },
      },
    });
    await this.prisma.juego.update({
      where: { id_juego: key.id_juego },
      data: {
        cantidad: total,
        cantidad_disponible: disponibles,
      },
    });

    return { message: 'Key eliminada y juego actualizado correctamente' };
  }

  /** Buscar keys por rango de precio */
  async findByPrecio(precio: number) {
    return this.prisma.key.findMany({
      where: {
        precio_venta: {
          gte: precio, // mayor o igual al precio dado
        },
      },
      include: {
        juego: true,
        estado_key: true,
        proveedor: true,
        plataforma: true,
      },
    });
  }

  /** Conteo de keys por juego */
  async countKeysByJuego() {
    const counts = await this.prisma.key.groupBy({
      by: ['id_juego'],
      _count: { id_key: true },
    });

    // Obtener títulos de juegos
    // para evitar hacer una consulta por cada juego
    const juegos = await this.prisma.juego.findMany({
      select: { id_juego: true, titulo: true },
    });

    return counts.map((c) => ({
      id_juego: c.id_juego,
      titulo: juegos.find((j) => j.id_juego === c.id_juego)?.titulo ?? null,
      cantidad: c._count.id_key,
    }));
  }

  /** Buscar keys por estado */
  async findByEstado(id: number, skip = 0, take = 20) {
    return this.prisma.key.findMany({
      where: { id_estado_key: id },
      skip,
      take,
      orderBy: { id_key: 'desc' },
      select: {
        id_key: true,
        key: true,
        precio_compra: true,
        precio_venta: true,
        proveedor: { select: { nombre: true } },
        juego: { select: { titulo: true } },
        plataforma: { select: { nombre: true } },
        estado_key: { select: { nombre: true } },
      },
    });
  }
}
