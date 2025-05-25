import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RawgService } from '../juego/rawg.service';

@Injectable()
export class EventoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rawgService: RawgService, // Asegúrate de inyectar RawgService
  ) {}

  // === ADMIN: Crear evento ===
  async crearEvento(data: {
    titulo: string;
    descripcion: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    id_juego: number;
    cantidad: number;
    id_evento_estado: number;
  }) {
    const regalo = await this.prisma.regalo_evento.create({
      data: {
        id_juego: data.id_juego,
        cantidad: data.cantidad,
        cantidad_disponible: data.cantidad,
      },
    });

    return this.prisma.evento.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin,
        id_regalo_evento: regalo.id_regalo_evento,
        id_evento_estado: data.id_evento_estado,
      },
    });
  }

  // === ADMIN: Editar evento ===
  async editarEvento(id_evento: number, data: any) {
    return this.prisma.evento.update({
      where: { id_evento },
      data,
    });
  }

  // === ADMIN: Eliminar evento ===
  async eliminarEvento(id_evento: number) {
    return this.prisma.evento.delete({
      where: { id_evento },
    });
  }

  // === USUARIO: Participar en evento y reclamar regalo ===
  async participarEnEvento(id_evento: number, id_usuario: number) {
    // 1. Buscar el evento y regalo
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
      include: { regalo_evento: true, evento_estado: true },
    });
    if (!evento || evento.evento_estado.nombre !== 'activo')
      throw new Error('Evento no disponible');

    // 2. Verificar si ya participó
    const yaTiene = await this.prisma.biblioteca.findFirst({
      where: {
        id_usuario,
        biblioteca_detalle: {
          some: {
            key: {
              id_juego: evento.regalo_evento.id_juego,
            },
          },
        },
      },
    });
    if (yaTiene) {
      throw new BadRequestException(
        'Ya reclamaste el regalo de este evento. Solo puedes reclamar una vez.',
      );
    }

    // 3. Verificar disponibilidad
    if (evento.regalo_evento.cantidad_disponible <= 0)
      throw new Error('No hay más regalos disponibles');

    // 4. Buscar una key disponible
    const key = await this.prisma.key.findFirst({
      where: {
        id_juego: evento.regalo_evento.id_juego,
        estado_key: { nombre: 'disponible' },
      },
    });
    if (!key) throw new Error('No hay keys disponibles para este juego');

    // 5. Obtener o crear biblioteca del usuario
    let biblioteca = await this.prisma.biblioteca.findFirst({
      where: { id_usuario },
    });
    if (!biblioteca) {
      biblioteca = await this.prisma.biblioteca.create({
        data: { id_usuario },
      });
    }

    // 6. Agregar key a la biblioteca del usuario
    await this.prisma.biblioteca_detalle.create({
      data: {
        id_biblioteca: biblioteca.id_biblioteca,
        id_key: key.id_key,
      },
    });

    // 7. Cambiar estado de la key a "regalada"
    const estadoRegalada = await this.prisma.estado_key.findFirst({
      where: { nombre: 'regalada' },
    });
    await this.prisma.key.update({
      where: { id_key: key.id_key },
      data: {
        id_estado_key: estadoRegalada?.id_estado_key ?? key.id_estado_key,
      },
    });

    // 8. Descontar disponibilidad
    await this.prisma.regalo_evento.update({
      where: { id_regalo_evento: evento.regalo_evento.id_regalo_evento },
      data: { cantidad_disponible: { decrement: 1 } },
    });

    return { mensaje: '¡Recibiste tu regalo!', key: key.key };
  }

  // === USUARIO: Listar eventos activos con portada ===
  async listarEventos() {
    const eventos = await this.prisma.evento.findMany({
      where: {
        evento_estado: { nombre: 'activo' },
      },
      include: {
        regalo_evento: {
          include: { juego: true },
        },
        evento_estado: true,
      },
    });

    // Agregar portada a cada evento usando RAWG
    const eventosConPortada = await Promise.all(
      eventos.map(async (evento) => {
        let portada: string | null = null;
        if (evento.regalo_evento?.juego?.titulo) {
          const rawg = await this.rawgService.searchGames(
            evento.regalo_evento.juego.titulo,
            1,
            1,
          );
          portada = rawg?.results?.[0]?.background_image ?? null;
        }
        return {
          ...evento,
          regalo_evento: {
            ...evento.regalo_evento,
            juego: {
              ...evento.regalo_evento.juego,
              portada,
            },
          },
        };
      }),
    );

    return eventosConPortada;
  }

  // === USUARIO/ADMIN: Historial de eventos (no activos) con portada ===
  async historialEventos() {
    const eventos = await this.prisma.evento.findMany({
      where: {
        evento_estado: { nombre: { not: 'activo' } },
      },
      include: {
        regalo_evento: {
          include: { juego: true },
        },
        evento_estado: true,
      },
    });

    // Agregar portada a cada evento usando RAWG
    const eventosConPortada = await Promise.all(
      eventos.map(async (evento) => {
        let portada: string | null = null;
        if (evento.regalo_evento?.juego?.titulo) {
          const rawg = await this.rawgService.searchGames(
            evento.regalo_evento.juego.titulo,
            1,
            1,
          );
          portada = rawg?.results?.[0]?.background_image ?? null;
        }
        return {
          ...evento,
          regalo_evento: {
            ...evento.regalo_evento,
            juego: {
              ...evento.regalo_evento.juego,
              portada,
            },
          },
        };
      }),
    );

    return eventosConPortada;
  }
}
