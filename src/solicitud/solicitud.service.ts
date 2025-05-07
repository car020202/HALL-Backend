import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AmistadService } from '../amistad/amistad.service';

@Injectable()
export class SolicitudService {
  constructor(
    private prisma: PrismaService,
    private amistadService: AmistadService,
  ) {}

  private async _getEstadoId(nombre: string): Promise<number> {
    const est = await this.prisma.estado_solicitud.findFirst({
      where: { nombre },
    });
    if (!est) throw new NotFoundException(`Estado '${nombre}' no encontrado`);
    return est.id_estado_solicitud;
  }

  async createSolicitud(id_solicitante: number, id_receptor: number) {
    const pendId = await this._getEstadoId('pendiente');
    const acepId = await this._getEstadoId('aceptada');

    const existing = await this.prisma.solicitud.findFirst({
      where: {
        id_solicitante,
        id_receptor,
        OR: [{ id_estado: pendId }, { id_estado: acepId }],
      },
    });
    if (existing) {
      throw new BadRequestException(
        'Ya existe una solicitud o amistad entre estos usuarios.',
      );
    }

    return this.prisma.solicitud.create({
      data: {
        id_solicitante,
        id_receptor,
        id_estado: pendId,
        fecha_solicitud: new Date(),
        fecha_confirmacion: new Date(),
      },
    });
  }

  async getSolicitudesRecibidas(id_receptor: number) {
    const pendId = await this._getEstadoId('pendiente');
    return this.prisma.solicitud.findMany({
      where: {
        id_receptor,
        id_estado: pendId, // solo pendientes
      },
      include: { solicitante: true, estado_solicitud: true },
    });
  }

  async respondSolicitud(id_solicitud: number, aceptar: boolean) {
    const sol = await this.prisma.solicitud.findUnique({
      where: { id_solicitud },
    });
    if (!sol)
      throw new NotFoundException(`Solicitud ${id_solicitud} no existe`);

    const pendId = await this._getEstadoId('pendiente');
    if (sol.id_estado !== pendId) {
      throw new BadRequestException('La solicitud ya fue respondida');
    }

    const nuevoEstado = await this._getEstadoId(
      aceptar ? 'aceptada' : 'rechazada',
    );
    const updated = await this.prisma.solicitud.update({
      where: { id_solicitud },
      data: {
        id_estado: nuevoEstado,
        fecha_confirmacion: new Date(),
      },
    });

    if (aceptar) {
      await this.amistadService.createAmistad(
        sol.id_solicitante,
        sol.id_receptor,
      );
    }

    return updated;
  }
}
