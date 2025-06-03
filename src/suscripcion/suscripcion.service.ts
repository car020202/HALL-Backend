import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { JuegoService } from '../juego/juego.service';

@Injectable()
export class SuscripcionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly juegoService: JuegoService,
  ) {}

  async obtenerJuegoDeLaSemana(id_usuario: number) {
    const config = await this.prisma.configuracion.findFirst();
    const semana = config?.semana_global ?? 1;

    const suscripcion = await this.prisma.suscripcion.findFirst({
      where: {
        id_usuario,
        estado_suscripcion: { nombre: 'activa' },
        fecha_inicio: { lte: new Date() },
        fecha_fin: { gte: new Date() },
      },
    });

    if (!suscripcion) return null;

    const juegoSuscripcion = await this.prisma.juego_suscripcion.findFirst({
      where: {
        id_tipo_suscripcion: suscripcion.id_tipo_suscripcion,
        semana_global: semana,
      },
      include: { juego: true },
    });

    if (!juegoSuscripcion) return null;

    return juegoSuscripcion.juego;
  }

  async obtenerHistorialJuegosPorSemana() {
    const semanas = await this.prisma.juego_suscripcion.findMany({
      include: {
        tipo_suscripcion: true,
        juego: true,
      },
      orderBy: [{ semana_global: 'desc' }, { id_tipo_suscripcion: 'asc' }],
    });

    const rawgService = this.juegoService['rawgService']; // manual access al servicio RAWG

    const agrupado = {};

    for (const entry of semanas) {
      const semana = entry.semana_global;
      if (!agrupado[semana]) agrupado[semana] = [];

      let portada = null;

      if (entry.juego?.titulo) {
        try {
          const { results } = await rawgService.searchGames(
            entry.juego.titulo,
            1,
            1,
          );
          portada = results?.[0]?.background_image ?? null;
        } catch (err) {
          portada = null;
        }
      }

      agrupado[semana].push({
        plan: entry.tipo_suscripcion.nombre,
        juego: entry.juego.titulo,
        portada,
      });
    }

    return agrupado;
  }

  async obtenerSuscripcionActiva(id_usuario: number) {
    const fechaActual = new Date();
    return this.prisma.suscripcion.findFirst({
      where: {
        id_usuario,
        fecha_inicio: { lte: fechaActual },
        fecha_fin: { gte: fechaActual },
        estado_suscripcion: { nombre: 'activa' },
      },
      include: {
        tipo_suscripcion: true,
        estado_suscripcion: true,
      },
      orderBy: { fecha_inicio: 'desc' },
    });
  }

  async obtenerHistorialSuscripciones(id_usuario: number) {
    return this.prisma.suscripcion.findMany({
      where: {
        id_usuario,
        estado_suscripcion: { NOT: { nombre: 'activa' } },
      },
      include: {
        tipo_suscripcion: true,
        estado_suscripcion: true,
      },
      orderBy: { fecha_inicio: 'desc' },
    });
  }

  async obtenerSuscripcionesPorUsuario(id_usuario: number) {
    return this.prisma.suscripcion.findMany({
      where: { id_usuario },
      include: {
        tipo_suscripcion: true,
        estado_suscripcion: true,
      },
      orderBy: { fecha_inicio: 'desc' },
    });
  }

  // Evitar que un usuario con suscripción activa se vuelva a suscribir
  async suscribirse(data: { id_usuario: number; id_tipo_suscripcion: number }) {
    const fechaActual = new Date();

    const asignarJuegos = async (
      id_usuario: number,
      id_tipo_suscripcion: number,
    ) => {
      const config = await this.prisma.configuracion.findFirst();
      const semana = config?.semana_global ?? 1;

      const planes = await this.prisma.tipo_suscripcion.findMany({
        where: {
          id_tipo_suscripcion: { lte: id_tipo_suscripcion },
        },
        orderBy: { id_tipo_suscripcion: 'asc' },
      });

      let biblioteca = await this.prisma.biblioteca.findFirst({
        where: { id_usuario },
      });
      if (!biblioteca) {
        biblioteca = await this.prisma.biblioteca.create({
          data: { id_usuario },
        });
      }

      for (const plan of planes) {
        const juegoSuscripcion = await this.prisma.juego_suscripcion.findFirst({
          where: {
            id_tipo_suscripcion: plan.id_tipo_suscripcion,
            semana_global: semana,
          },
        });

        if (!juegoSuscripcion) continue;

        // Evita duplicado si ya se tiene un key de ese juego
        const yaTieneElJuego = await this.prisma.biblioteca_detalle.findFirst({
          where: {
            id_biblioteca: biblioteca.id_biblioteca,
            key: {
              is: {
                id_juego: juegoSuscripcion.id_juego,
              },
            },
          },
        });

        if (yaTieneElJuego) continue;

        const keysDisponibles = await this.prisma.key.findMany({
          where: {
            id_juego: juegoSuscripcion.id_juego,
            estado_key: { nombre: 'disponible' },
          },
        });

        if (keysDisponibles.length > 0) {
          const keyAleatoria =
            keysDisponibles[Math.floor(Math.random() * keysDisponibles.length)];

          await this.prisma.biblioteca_detalle.create({
            data: {
              id_biblioteca: biblioteca.id_biblioteca,
              id_key: keyAleatoria.id_key,
            },
          });

          await this.prisma.key.update({
            where: { id_key: keyAleatoria.id_key },
            data: { id_estado_key: 2 },
          });
        }
      }
    };

    const suscripcionActiva = await this.prisma.suscripcion.findFirst({
      where: {
        id_usuario: data.id_usuario,
        fecha_inicio: { lte: fechaActual },
        fecha_fin: { gte: fechaActual },
        estado_suscripcion: { nombre: 'activa' },
      },
    });

    if (suscripcionActiva) {
      if (suscripcionActiva.id_tipo_suscripcion === data.id_tipo_suscripcion) {
        return {
          mensaje: 'Ya tienes una suscripción activa a este mismo plan.',
          yaSuscrito: true,
        };
      }

      const planActual = await this.prisma.tipo_suscripcion.findUnique({
        where: { id_tipo_suscripcion: suscripcionActiva.id_tipo_suscripcion },
      });

      const nuevoPlan = await this.prisma.tipo_suscripcion.findUnique({
        where: { id_tipo_suscripcion: data.id_tipo_suscripcion },
      });

      if (!planActual || !nuevoPlan) {
        throw new Error('Error al comparar niveles de suscripción.');
      }

      // Mejora de plan
      if (nuevoPlan.precio > planActual.precio) {
        const estadoCancelada = await this.prisma.estado_suscripcion.findFirst({
          where: { nombre: 'cancelada' },
        });

        if (!estadoCancelada) {
          throw new Error('No se encontró el estado "cancelada".');
        }

        await this.prisma.suscripcion.update({
          where: { id_suscripcion: suscripcionActiva.id_suscripcion },
          data: {
            estado_suscripcion: {
              connect: {
                id_estado_suscripcion: estadoCancelada.id_estado_suscripcion,
              },
            },
          },
        });

        const fecha_inicio = new Date();
        const fecha_fin = new Date();
        fecha_fin.setDate(fecha_inicio.getDate() + 7);

        const estado = await this.prisma.estado_suscripcion.findFirst({
          where: { nombre: 'activa' },
        });

        if (!estado) {
          throw new Error(
            'No se encontró el estado "activa" en la base de datos.',
          );
        }

        const nuevaSuscripcion = await this.prisma.suscripcion.create({
          data: {
            id_usuario: data.id_usuario,
            id_tipo_suscripcion: data.id_tipo_suscripcion,
            fecha_inicio,
            fecha_fin,
            id_estado_suscripcion: estado.id_estado_suscripcion,
            renovacion_automatica: true,
          },
        });

        await asignarJuegos(data.id_usuario, data.id_tipo_suscripcion);

        return {
          mensaje: 'Has mejorado tu plan. Nueva suscripción activa.',
          yaSuscrito: false,
          suscripcion: nuevaSuscripcion,
        };
      }

      // Degradación de plan
      await this.prisma.suscripcion.update({
        where: { id_suscripcion: suscripcionActiva.id_suscripcion },
        data: {
          id_tipo_suscripcion: data.id_tipo_suscripcion,
        },
      });

      return {
        mensaje:
          'Tu plan fue degradado con éxito. Mantendrás la duración actual.',
        yaSuscrito: true,
        cambioDePlan: true,
      };
    }

    // Nueva suscripción
    const fecha_inicio = new Date();
    const fecha_fin = new Date();
    fecha_fin.setDate(fecha_inicio.getDate() + 7);

    const estado = await this.prisma.estado_suscripcion.findFirst({
      where: { nombre: 'activa' },
    });

    if (!estado) {
      throw new Error('No se encontró el estado "activa" en la base de datos.');
    }

    const suscripcion = await this.prisma.suscripcion.create({
      data: {
        id_usuario: data.id_usuario,
        id_tipo_suscripcion: data.id_tipo_suscripcion,
        fecha_inicio,
        fecha_fin,
        id_estado_suscripcion: estado.id_estado_suscripcion,
        renovacion_automatica: true,
      },
    });

    await asignarJuegos(data.id_usuario, data.id_tipo_suscripcion);

    return {
      mensaje: 'Suscripción creada exitosamente.',
      yaSuscrito: false,
      suscripcion,
    };
  }

  // Cancelar la renovación automática de una suscripción activa
  async cancelarRenovacion(id_usuario: number) {
    return await this.prisma.suscripcion.updateMany({
      where: {
        id_usuario,
        fecha_inicio: { lte: new Date() },
        fecha_fin: { gte: new Date() },
        estado_suscripcion: { nombre: 'activa' },
      },
      data: { renovacion_automatica: false },
    });
  }

  // Asignar juegos automáticos por plan y semana
  async asignarJuegosAutomaticamentePorPrecioKey(semana_global: number) {
    const planes = [
      { id: 1, min: 0, max: 10 },
      { id: 2, min: 10, max: 30 },
      { id: 3, min: 30, max: 9999 },
    ];

    for (const plan of planes) {
      // Verificar si ya se asignó un juego para este plan y semana
      const yaExiste = await this.prisma.juego_suscripcion.findFirst({
        where: {
          id_tipo_suscripcion: plan.id,
          semana_global: semana_global,
        },
      });

      if (yaExiste) {
        console.log(
          `Ya hay juego asignado para el plan ${plan.id} en la semana ${semana_global}`,
        );
        continue;
      }

      const juegos = await this.prisma.juego.findMany({
        where: {
          key: {
            some: {
              estado_key: { nombre: 'disponible' },
              precio_venta: { gte: plan.min, lt: plan.max },
            },
          },
        },
        include: {
          key: {
            where: {
              estado_key: { nombre: 'disponible' },
              precio_venta: { gte: plan.min, lt: plan.max },
            },
            orderBy: { precio_venta: 'asc' },
            take: 1,
          },
        },
      });

      if (juegos.length === 0) {
        console.warn(`No hay juegos disponibles para el plan ${plan.id}`);
        continue;
      }

      const juegoAleatorio = juegos[Math.floor(Math.random() * juegos.length)];

      await this.prisma.juego_suscripcion.create({
        data: {
          id_tipo_suscripcion: plan.id,
          id_juego: juegoAleatorio.id_juego,
          semana_global,
        },
      });

      console.log(
        `Juego asignado al plan ${plan.id} en semana ${semana_global}`,
      );
    }
  }

  // Asignar manualmente un juego a un plan
  async asignarJuegoAPlan(data: {
    id_tipo_suscripcion: number;
    id_juego: number;
    semana_global: number;
  }) {
    return this.prisma.juego_suscripcion.create({
      data: {
        id_tipo_suscripcion: data.id_tipo_suscripcion,
        id_juego: data.id_juego,
        semana_global: data.semana_global,
      },
    });
  }

  // Asignar juegos a usuarios activos
  async asignarJuegosSemanales() {
    const hoy = new Date();
    const suscripciones = await this.prisma.suscripcion.findMany({
      where: {
        fecha_inicio: { lte: hoy },
        fecha_fin: { gte: hoy },
        estado_suscripcion: { nombre: 'activa' },
      },
    });

    for (const sus of suscripciones) {
      const semanaActual =
        Math.floor(
          (hoy.getTime() - sus.fecha_inicio.getTime()) /
            (7 * 24 * 60 * 60 * 1000),
        ) + 1;

      const juegoSuscripcion = await this.prisma.juego_suscripcion.findFirst({
        where: {
          id_tipo_suscripcion: sus.id_tipo_suscripcion,
          semana_global: semanaActual,
        },
        include: { juego: true },
      });

      if (juegoSuscripcion) {
        let biblioteca = await this.prisma.biblioteca.findFirst({
          where: { id_usuario: sus.id_usuario },
        });
        if (!biblioteca) {
          biblioteca = await this.prisma.biblioteca.create({
            data: { id_usuario: sus.id_usuario },
          });
        }

        const key = await this.prisma.key.findFirst({
          where: {
            id_juego: juegoSuscripcion.id_juego,
            estado_key: { nombre: 'disponible' },
          },
        });

        if (key) {
          await this.prisma.biblioteca_detalle.create({
            data: {
              id_biblioteca: biblioteca.id_biblioteca,
              id_key: key.id_key,
            },
          });

          await this.prisma.key.update({
            where: { id_key: key.id_key },
            data: { id_estado_key: 2 },
          });
        }
      }
    }
  }

  // Cron job semanal para asignar juegos a planes automáticamente
  @Cron(CronExpression.EVERY_WEEK)
  async asignarJuegosSemanalAuto() {
    const config = await this.prisma.configuracion.findFirst();
    const semana = config?.semana_global ?? 1;
    await this.asignarJuegosAutomaticamentePorPrecioKey(semana);
  }
}
