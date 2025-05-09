import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AmistadService {
  constructor(private prisma: PrismaService) {}

  async getAmistades(id_usuario: number) {
    // traigo los pares de amistad junto con los datos de usuario A y B
    const relaciones = await this.prisma.amistad.findMany({
      where: {
        OR: [{ id_usuario_a: id_usuario }, { id_usuario_b: id_usuario }],
      },
      include: {
        usuarioA: { select: { id_usuario: true, nombre: true, email: true } },
        usuarioB: { select: { id_usuario: true, nombre: true, email: true } },
      },
    });

    // mapeo para quedarme solo con el “otro” usuario en cada relación
    return relaciones.map((rel) => {
      const esUsuarioA = rel.id_usuario_a === id_usuario;
      const amigo = esUsuarioA ? rel.usuarioB : rel.usuarioA;
      return {
        id_usuario: amigo.id_usuario,
        nombre: amigo.nombre,
        email: amigo.email,
      };
    });
  }

  async createAmistad(id_usuario_a: number, id_usuario_b: number) {
    // Verificar si ya existe una amistad entre los mismos usuarios
    const existingAmistad = await this.prisma.amistad.findFirst({
      where: {
        OR: [
          { id_usuario_a, id_usuario_b },
          { id_usuario_a: id_usuario_b, id_usuario_b: id_usuario_a },
        ],
      },
    });

    if (existingAmistad) {
      throw new BadRequestException(
        'La amistad entre estos usuarios ya existe.',
      );
    }

    // Crear la nueva amistad
    const amistad = await this.prisma.amistad.create({
      data: { id_usuario_a, id_usuario_b },
    });

    return { message: 'Amistad creada exitosamente', amistad };
  }

  async deleteAmistad(id_usuario_a: number, id_usuario_b: number) {
    // 1) Eliminar la amistad
    const deleted = await this.prisma.amistad.deleteMany({
      where: {
        OR: [
          { id_usuario_a, id_usuario_b },
          { id_usuario_a: id_usuario_b, id_usuario_b: id_usuario_a },
        ],
      },
    });

    if (deleted.count === 0) {
      throw new BadRequestException(
        'No existe amistad entre estos usuarios para eliminar.',
      );
    }

    // 2) Borrar también cualquier solicitud ACEPTADA entre ellos
    //    (para que puedan volver a enviarse nuevas solicitudes)
    const estadoAceptada = await this.prisma.estado_solicitud.findFirst({
      where: { nombre: 'aceptada' },
    });
    if (estadoAceptada) {
      await this.prisma.solicitud.deleteMany({
        where: {
          id_estado: estadoAceptada.id_estado_solicitud,
          OR: [
            { id_solicitante: id_usuario_a, id_receptor: id_usuario_b },
            { id_solicitante: id_usuario_b, id_receptor: id_usuario_a },
          ],
        },
      });
    }

    return { message: 'Amistad eliminada exitosamente' };
  }
}
