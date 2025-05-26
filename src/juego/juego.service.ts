import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RawgService } from './rawg.service';

@Injectable()
export class JuegoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rawgService: RawgService,
  ) {}

  /** Crear un juego nuevo en BD */
  async create(data: {
    titulo: string;
    descripcion: string;
    id_categoria_juego: number;
    cantidad: number;
    cantidad_disponible: number;
  }) {
    return this.prisma.juego.create({ data });
  }

  /** Solo BD: listar todos los juegos sin extras */
  async findAll() {
    return this.prisma.juego.findMany({
      include: {
        categoria: true,
        key: {
          include: {
            plataforma: true, // Incluye la plataforma de cada key
          },
        },
      },
    });
  }
  /** Juegos con portada y precio mínimo filtrados por plataforma */
  async findByPlataformaWithPortadas(id_plataforma: number) {
    const juegos = await this.prisma.juego.findMany({
      where: {
        key: {
          some: {
            estado_key: { nombre: 'disponible' },
            plataforma: { id_plataforma },
          },
        },
      },
      include: {
        categoria: true,
        key: {
          where: {
            estado_key: { nombre: 'disponible' },
            plataforma: { id_plataforma },
          },
          select: {
            precio_venta: true,
            plataforma: true, // ✅ incluir datos de la plataforma
          },
        },
      },
    });

    const juegosConExtras = await Promise.all(
      juegos.map(async (j) => {
        const { results } = await this.rawgService.searchGames(j.titulo, 1, 1);
        const portada = results?.[0]?.background_image ?? null;

        const ventas = j.key.map((k) => Number(k.precio_venta));
        const precioMin = ventas.length ? Math.min(...ventas) : null;

        return {
          ...j,
          portada,
          categoriaNombre: j.categoria.nombre,
          precio: precioMin,
          plataformas: [
            ...new Map(
              j.key
                .filter((k) => k.plataforma)
                .map((k) => [k.plataforma.id_plataforma, k.plataforma]),
            ).values(),
          ], // plataformas únicas asociadas a este juego
        };
      }),
    );

    return juegosConExtras;
  }

  /** BD + portada RAWG + precio mínimo de venta */
  async findAllWithPortadas() {
    // 1) Traer juegos con categoría y solo las keys disponibles (precio_venta)
    const juegos = await this.prisma.juego.findMany({
      include: {
        categoria: true,
        key: {
          where: {
            estado_key: { nombre: 'disponible' },
          },
          select: {
            precio_venta: true,
          },
        },
      },
    });

    // 2) Para cada juego, buscar portada y calcular precio mínimo
    const juegosConExtras = await Promise.all(
      juegos.map(async (j) => {
        // RAWG: buscamos la portada
        const { results } = await this.rawgService.searchGames(j.titulo, 1, 1);
        const portada = results?.[0]?.background_image ?? null;

        // Calculamos precio mínimo de venta
        const ventas = j.key.map((k) => Number(k.precio_venta));
        const precioMin = ventas.length ? Math.min(...ventas) : null;

        return {
          ...j,
          portada,
          categoriaNombre: j.categoria.nombre,
          precio: precioMin,
        };
      }),
    );

    return juegosConExtras;
  }

  /** BD + portada RAWG + precio mínimo de venta para un solo juego */
  async findOne(id_juego: number) {
    // 1) Buscamos en BD
    const juego = await this.prisma.juego.findUnique({
      where: { id_juego },
      include: {
        categoria: true,
        key: {
          where: {
            estado_key: { nombre: 'disponible' },
          },
          select: {
            id_key: true,
            precio_venta: true,
            plataforma: true, // <-- Incluye la plataforma de cada key
          },
        },
      },
    });
    if (!juego) {
      throw new NotFoundException(`Juego con ID ${id_juego} no encontrado.`);
    }

    // 2) RAWG: portada
    const { results } = await this.rawgService.searchGames(juego.titulo, 1, 1);
    const portada = results?.[0]?.background_image ?? null;

    // 3) Precio mínimo
    const ventas = juego.key.map((k) => Number(k.precio_venta));
    const precioMin = ventas.length ? Math.min(...ventas) : null;

    // 4) Devolver todo junto
    return {
      ...juego,
      portada,
      precio: precioMin,
      categoriaNombre: juego.categoria.nombre,
      plataformas: [
        ...new Map(
          juego.key
            .filter((k) => k.plataforma)
            .map((k) => [k.plataforma.id_plataforma, k.plataforma]),
        ).values(),
      ], // plataformas únicas asociadas al juego
    };
  }

  /** Actualizar un juego */
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
    // valida existencia
    await this.findOne(id_juego);
    return this.prisma.juego.update({
      where: { id_juego },
      data,
    });
  }

  /** Borrar un juego */
  async remove(id_juego: number) {
    // valida existencia
    await this.findOne(id_juego);
    return this.prisma.juego.delete({ where: { id_juego } });
  }
}
