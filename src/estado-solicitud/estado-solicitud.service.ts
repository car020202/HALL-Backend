import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EstadoSolicitudService {
  constructor(private prisma: PrismaService) {}

  async create(data: { nombre: string }) {
    return this.prisma.estado_solicitud.create({ data });
  }

  async findAll() {
    return this.prisma.estado_solicitud.findMany();
  }

  async findOne(id: number) {
    const estado = await this.prisma.estado_solicitud.findUnique({
      where: { id_estado_solicitud: id },
    });
    if (!estado) throw new NotFoundException(`Estado ${id} no encontrado`);
    return estado;
  }

  async update(id: number, data: { nombre?: string }) {
    await this.findOne(id);
    return this.prisma.estado_solicitud.update({
      where: { id_estado_solicitud: id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.estado_solicitud.delete({
      where: { id_estado_solicitud: id },
    });
  }
}
