import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolService {
  constructor(private prisma: PrismaService) {}

  async createRol(nombre: string) {
    const rol = await this.prisma.rol.create({
      data: { nombre },
    });
    return { message: 'Rol creado exitosamente', rol };
  }

  async getRoles() {
    return this.prisma.rol.findMany();
  }
}
