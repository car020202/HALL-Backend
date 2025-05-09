import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RawgService } from './rawg.service';

@Injectable()
export class JuegoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rawgService: RawgService, // ← inyectamos RawgService
  ) {}

  async create(data: {
    titulo: string;
    descripcion: string;
    id_categoria_juego: number;
    cantidad: number;
    cantidad_disponible: number;
  }) {
    return this.prisma.juego.create({ data });
  }

  /** Solo DB */
  async findAll() {
    return this.prisma.juego.findMany();
  }

  /** DB + portada desde RAWG */
  async findAllWithPortadas() {
    // Incluimos la categoría en la misma consulta a la BD
    const juegos = await this.prisma.juego.findMany({
      include: { categoria: true },
    });

    const juegosConPortada = await Promise.all(
      juegos.map(async (juego) => {
        const { results } = await this.rawgService.searchGames(
          juego.titulo,
          1,
          1,
        );
        const portada = results?.[0]?.background_image ?? null;
        return {
          ...juego,
          portada,
          categoriaNombre: juego.categoria.nombre,
        };
      }),
    );

    return juegosConPortada;
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
    await this.findOne(id_juego);
    return this.prisma.juego.update({ where: { id_juego }, data });
  }

  async remove(id_juego: number) {
    await this.findOne(id_juego);
    return this.prisma.juego.delete({ where: { id_juego } });
  }
}
