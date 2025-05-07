import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProveedoresService {
  constructor(private prisma: PrismaService) {}

  async create(data: { nombre: string; contacto: string; correo: string }) {
    return this.prisma.proveedores.create({ data });
  }

  async findAll() {
    return this.prisma.proveedores.findMany();
  }

  async findOne(id: number) {
    const p = await this.prisma.proveedores.findUnique({
      where: { id_proveedor: id },
    });
    if (!p) throw new NotFoundException(`Proveedor ${id} no encontrado`);
    return p;
  }

  async update(
    id: number,
    data: { nombre?: string; contacto?: string; correo?: string },
  ) {
    await this.findOne(id);
    return this.prisma.proveedores.update({
      where: { id_proveedor: id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.proveedores.delete({
      where: { id_proveedor: id },
    });
  }
}
