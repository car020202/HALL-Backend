import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RawgService } from '../juego/rawg.service'; // importa el servicio RAWG

@Injectable()
export class BibliotecaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rawgService: RawgService, // inyecta el servicio RAWG
  ) {}

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
        biblioteca_detalle: {
          include: {
            key: {
              include: {
                juego: true, // Incluye los datos del juego de la key
              },
            },
          },
        },
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

  /** Devuelve los juegos y keys de la biblioteca de un usuario, con portada */
  async getBibliotecaPorUsuario(id_usuario: number) {
    // 1. Busca la biblioteca y sus detalles
    const biblioteca = await this.prisma.biblioteca.findFirst({
      where: { id_usuario },
      include: {
        biblioteca_detalle: {
          include: {
            key: {
              include: {
                juego: true,
                plataforma: true,
              },
            },
          },
        },
      },
    });
    if (!biblioteca) return [];

    // 2. Agrupa las keys por juego
    const juegosMap = new Map<
      number,
      {
        juego: any;
        keys: any[];
      }
    >();
    for (const detalle of biblioteca.biblioteca_detalle) {
      const { key } = detalle;
      if (!juegosMap.has(key.juego.id_juego)) {
        juegosMap.set(key.juego.id_juego, {
          juego: key.juego,
          keys: [],
        });
      }
      juegosMap.get(key.juego.id_juego)!.keys.push({
        id_key: key.id_key,
        key: key.key,
        plataforma: key.plataforma.nombre,
      });
    }

    // 3. Para cada juego, busca la portada y arma la respuesta
    const resultado: Array<{
      id_juego: number;
      titulo: string;
      descripcion: string;
      portada: string | null;
      cantidad: number;
      keys: Array<{
        id_key: number;
        key: string;
        plataforma: string;
      }>;
    }> = [];
    for (const { juego, keys } of juegosMap.values()) {
      // Busca la portada usando RAWG
      const { results } = await this.rawgService.searchGames(
        juego.titulo,
        1,
        1,
      );
      const portada = results?.[0]?.background_image ?? null;
      resultado.push({
        id_juego: juego.id_juego,
        titulo: juego.titulo,
        descripcion: juego.descripcion,
        portada,
        cantidad: keys.length,
        keys,
      });
    }
    return resultado;
  }
}
