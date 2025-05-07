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
    // Solo impide crear si la solicitud previa está pendiente o aceptada.
    const existente = await this.prisma.solicitud.findFirst({
      where: {
        OR: [
          { id_solicitante, id_receptor },
          { id_solicitante: id_receptor, id_receptor: id_solicitante },
        ],
        id_estado: { in: [1, 2] }, // 1: Pendiente, 2: Aceptada
      },
    });

    if (existente) {
      throw new BadRequestException(
        'Ya existe una solicitud pendiente o son amigos.',
      );
    }

    // Si no hay solicitudes pendientes o aceptadas, crea una nueva
    return this.prisma.solicitud.create({
      data: {
        id_solicitante,
        id_receptor,
        id_estado: 1, // Pendiente
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
