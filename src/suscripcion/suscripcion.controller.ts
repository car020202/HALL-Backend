import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('suscripcion')
export class SuscripcionController {
  constructor(private readonly suscripcionService: SuscripcionService) {}

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
