import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AmistadService {
  constructor(private prisma: PrismaService) {}

  async getAmistades(id_usuario: number) {
    return this.prisma.amistad.findMany({
      where: {
        OR: [{ id_usuario_a: id_usuario }, { id_usuario_b: id_usuario }],
      },
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

    return { message: 'Amistad eliminada exitosamente' };
  }
}
