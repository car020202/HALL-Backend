import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  /** Permite devolver una key si han pasado menos de 30 minutos desde la compra */
  async devolverKey(id_usuario: number, id_key: number) {
    // 1. Buscar la biblioteca del usuario
    const biblioteca = await this.prisma.biblioteca.findFirst({
      where: { id_usuario },
    });
    if (!biblioteca) throw new NotFoundException('Biblioteca no encontrada.');

    // 2. Buscar el detalle de biblioteca para esa key
    const detalle = await this.prisma.biblioteca_detalle.findFirst({
      where: {
        id_biblioteca: biblioteca.id_biblioteca,
        id_key,
      },
    });
    if (!detalle)
      throw new NotFoundException('La key no está en tu biblioteca.');

    // 3. Buscar la última transacción de venta de esa key para ese usuario
    const transaccionKey = await this.prisma.transaccion_key.findFirst({
      where: { id_key },
      orderBy: { id_transaccion_key: 'desc' },
      include: {
        transaccion: true,
      },
    });
    if (
      !transaccionKey ||
      transaccionKey.transaccion.id_usuario !== id_usuario ||
      transaccionKey.transaccion.id_tipo_transaccion !== 2 // 2 = venta (ajusta si tu id es diferente)
    ) {
      throw new BadRequestException(
        'No tienes permiso para devolver esta key.',
      );
    }

    // 4. Verificar si han pasado menos de 30 minutos
    const fechaCompra = new Date(transaccionKey.transaccion.fecha);
    const ahora = new Date();
    const minutos = (ahora.getTime() - fechaCompra.getTime()) / 60000;
    if (minutos > 30) {
      throw new BadRequestException(
        'Solo puedes devolver la key dentro de los primeros 30 minutos.',
      );
    }

    // 5. Eliminar la key de la biblioteca del usuario
    await this.prisma.biblioteca_detalle.delete({
      where: { id_biblioteca_detalle: detalle.id_biblioteca_detalle },
    });

    // 6. Cambiar el estado de la key a "deshabilitada"
    const estadoDeshabilitada = await this.prisma.estado_key.findFirst({
      where: { nombre: 'deshabilitada' },
    });
    if (!estadoDeshabilitada)
      throw new NotFoundException('Estado "deshabilitada" no encontrado.');

    await this.prisma.key.update({
      where: { id_key },
      data: { id_estado_key: estadoDeshabilitada.id_estado_key }, // Usa el campo correcto
    });

    return { mensaje: 'Key devuelta y deshabilitada correctamente.' };
  }

  async getJuegosDeAmigo(id_usuario: number, id_amigo: number) {
    // Verifica si son amigos (usando id_usuario_a y id_usuario_b)
    const amistad = await this.prisma.amistad.findFirst({
      where: {
        OR: [
          { id_usuario_a: id_usuario, id_usuario_b: id_amigo },
          { id_usuario_a: id_amigo, id_usuario_b: id_usuario },
        ],
      },
    });

    if (!amistad) {
      throw new BadRequestException(
        'No tienes permiso para ver la biblioteca de este usuario.',
      );
    }

    // Buscar la biblioteca del amigo
    const biblioteca = await this.prisma.biblioteca.findFirst({
      where: { id_usuario: id_amigo },
      include: {
        biblioteca_detalle: {
          include: {
            key: {
              include: {
                juego: true,
              },
            },
          },
        },
      },
    });

    if (!biblioteca) return [];

    // Agrupar juegos únicos y buscar portadas
    const juegosMap = new Map<
      number,
      {
        id_juego: number;
        titulo: string;
        descripcion: string;
        portada: string | null;
      }
    >();

    for (const detalle of biblioteca.biblioteca_detalle) {
      const juego = detalle.key.juego;
      if (!juegosMap.has(juego.id_juego)) {
        const { results } = await this.rawgService.searchGames(
          juego.titulo,
          1,
          1,
        );
        const portada = results?.[0]?.background_image ?? null;

        juegosMap.set(juego.id_juego, {
          id_juego: juego.id_juego,
          titulo: juego.titulo,
          descripcion: juego.descripcion,
          portada,
        });
      }
    }

    return Array.from(juegosMap.values());
  }
}
