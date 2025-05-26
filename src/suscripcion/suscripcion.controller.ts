import { Param, ParseIntPipe } from '@nestjs/common';
import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { AuthGuard } from '@nestjs/passport';
import { JuegoService } from '../juego/juego.service';

@Controller('suscripcion')
export class SuscripcionController {
  constructor(
    private readonly suscripcionService: SuscripcionService,
    private readonly juegoService: JuegoService,
  ) {}

  @Get(':id/activa')
  async obtenerSuscripcionActiva(@Param('id', ParseIntPipe) id: number) {
    return this.suscripcionService.obtenerSuscripcionActiva(id);
  }

  @Get(':id/historial')
  async obtenerHistorialSuscripciones(@Param('id', ParseIntPipe) id: number) {
    return this.suscripcionService.obtenerHistorialSuscripciones(id);
  }

  @Get('tipos')
  async obtenerTiposConJuegoActual() {
    const config =
      await this.suscripcionService['prisma'].configuracion.findFirst();
    const semana = config?.semana_global ?? 1;

    const tipos = await this.suscripcionService[
      'prisma'
    ].tipo_suscripcion.findMany({
      include: {
        juego_suscripcion: {
          where: { semana_global: semana },
          include: {
            juego: true,
          },
        },
      },
    });

    return await Promise.all(
      tipos.map(async (tipo) => {
        const juego = tipo.juego_suscripcion[0]?.juego || null;

        let portada = null;
        if (juego) {
          const { results } = await this.juegoService[
            'rawgService'
          ].searchGames(juego.titulo, 1, 1);
          portada = results?.[0]?.background_image ?? null;
        }

        return {
          id_tipo_suscripcion: tipo.id_tipo_suscripcion,
          nombre: tipo.nombre,
          precio: tipo.precio,
          juegoActual: juego
            ? {
                ...juego,
                portada,
              }
            : null,
        };
      }),
    );
  }

  @Get(':id')
  async obtenerSuscripcionesPorUsuario(@Param('id', ParseIntPipe) id: number) {
    const suscripciones =
      await this.suscripcionService.obtenerSuscripcionesPorUsuario(id);
    return suscripciones;
  }

  // Endpoint para asignar juegos a los planes por precio de key
  @Post('asignar-juegos-semana')
  async asignarJuegosSemana(@Body() body: { semana_global: number }) {
    await this.suscripcionService.asignarJuegosAutomaticamentePorPrecioKey(
      body.semana_global,
    );
    return {
      mensaje: 'Juegos asignados automáticamente a los planes para la semana.',
    };
  }

  // Endpoint para suscribirse a un plan
  @Post('suscribirse')
  async suscribirse(
    @Body() body: { id_usuario: number; id_tipo_suscripcion: number },
  ) {
    const result = await this.suscripcionService.suscribirse(body);
    return { mensaje: 'Suscripción creada.', result };
  }

  // Endpoint para asignar juegos semanales a usuarios activos
  @Post('asignar-juegos-usuarios')
  async asignarJuegosUsuarios() {
    await this.suscripcionService.asignarJuegosSemanales();
    return { mensaje: 'Juegos asignados a los usuarios activos.' };
  }

  // Endpoint manual para asignar un juego a un plan y semana
  @Post('asignar-juego-plan')
  async asignarJuegoAPlan(
    @Body()
    body: {
      id_tipo_suscripcion: number;
      id_juego: number;
      semana_global: number;
    },
  ) {
    const result = await this.suscripcionService.asignarJuegoAPlan(body);
    return { mensaje: 'Juego asignado al plan correctamente.', result };
  }

  @Post('cancelar-renovacion')
  async cancelarRenovacion(@Body() body: { id_usuario: number }) {
    const updated = await this.suscripcionService.cancelarRenovacion(
      body.id_usuario,
    );
    return { mensaje: 'Renovación automática cancelada.', updated };
  }
}
