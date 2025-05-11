import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RawgService } from './rawg.service';

@Injectable()
export class JuegoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rawgService: RawgService, //inyectamos RawgService
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

  /** DB + portada desde RAWG + precio mínimo */
  async findAllWithPortadas() {
    const juegos = await this.prisma.juego.findMany({
      include: {
        categoria: true,
        key: {
          where: {
            estado_key: {
              nombre: 'disponible', // solo claves disponibles
            },
          },
          select: {
            precio: true,
          },
        },
      },
    });

    const juegosConExtras = await Promise.all(
      juegos.map(async (juego) => {
        const { results } = await this.rawgService.searchGames(
          juego.titulo,
          1,
          1,
        );

        const portada = results?.[0]?.background_image ?? null;
        const precios = juego.key.map((k) => Number(k.precio));
        const precioMinimo = precios.length ? Math.min(...precios) : null;

        return {
          ...juego,
          portada,
          categoriaNombre: juego.categoria.nombre,
          precio: precioMinimo,
        };
      }),
    );

    return juegosConExtras;
  }

  async findOne(id_juego: number) {
    const juego = await this.prisma.juego.findUnique({
      where: { id_juego },
      include: { categoria: true },
    });

    if (!juego) {
      throw new NotFoundException(`Juego con ID ${id_juego} no encontrado.`);
    }

    // Obtener la portada del juego desde RAWG
    const { results } = await this.rawgService.searchGames(juego.titulo, 1, 1);
    const portada = results?.[0]?.background_image ?? null;

    // Agregar la portada al objeto juego
    return {
      ...juego,
      portada,
    };
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
