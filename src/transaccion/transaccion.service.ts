import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface SaleParams {
  userId: number;
  keys: number[];
  descripcion?: string;
}

interface PurchaseParams {
  adminId: number;
  proveedorId: number;
  juegoId: number;
  plataformaId: number;
  cantidad: number;
  precioCompra: number;
  precioVenta: number;
  descripcion?: string;
}

@Injectable()
export class TransaccionService {
  constructor(private readonly prisma: PrismaService) {}

  // === Venta ===
  async processSale({ userId, keys, descripcion }: SaleParams) {
    // 1) Cargar las keys y sus precios de venta
    const keyRecords = await this.prisma.key.findMany({
      where: { id_key: { in: keys } },
      select: {
        id_key: true,
        id_juego: true,
        precio_venta: true,
      },
    });
    if (keyRecords.length !== keys.length)
      throw new NotFoundException('Alguna de las keys no existe');

    // 2) Calcular monto total de venta
    const monto = keyRecords.reduce(
      (sum, k) => sum + Number(k.precio_venta),
      0,
    );

    // 3) Obtener estados
    const [estadoVend, estadoDisp] = await Promise.all([
      this.prisma.estado_key.findFirst({ where: { nombre: 'vendida' } }),
      this.prisma.estado_key.findFirst({ where: { nombre: 'disponible' } }),
    ]);
    if (!estadoVend || !estadoDisp)
      throw new NotFoundException('Faltan estados "vendida" o "disponible"');

    // 4) Transacción atómica
    const trans = await this.prisma.$transaction(async (tx) => {
      const t = await tx.transaccion.create({
        data: {
          id_usuario: userId,
          id_tipo_transaccion: 2, // asume 2=venta
          monto,
          descripcion: descripcion ?? 'Venta de keys',
        },
      });

      for (const k of keyRecords) {
        await tx.transaccion_key.create({
          data: { id_transaccion: t.id_transaccion, id_key: k.id_key },
        });
        await tx.detalle_transaccion.create({
          data: {
            id_transaccion: t.id_transaccion,
            id_juego: k.id_juego,
            cantidad: 1,
            precio_unitario: k.precio_venta,
          },
        });
        await tx.key.update({
          where: { id_key: k.id_key },
          data: { id_estado_key: estadoVend.id_estado_key },
        });

        // Recalcular contadores
        const total = await tx.key.count({ where: { id_juego: k.id_juego } });
        const disponibles = await tx.key.count({
          where: {
            id_juego: k.id_juego,
            id_estado_key: estadoDisp.id_estado_key,
          },
        });
        await tx.juego.update({
          where: { id_juego: k.id_juego },
          data: { cantidad: total, cantidad_disponible: disponibles },
        });
      }
      return t;
    });

    return { mensaje: 'Venta registrada', transaccion: trans };
  }

  // === Compra ===
  async processPurchase(params: PurchaseParams) {
    const {
      adminId,
      proveedorId,
      juegoId,
      plataformaId,
      cantidad,
      precioCompra,
      precioVenta,
      descripcion,
    } = params;

    // Verificar admin
    const admin = await this.prisma.usuario.findUnique({
      where: { id_usuario: adminId },
      include: { rol: true },
    });
    if (!admin || admin.rol.id_rol !== 1)
      throw new UnauthorizedException('Solo admin puede comprar keys');

    // Estado y tipo
    const estadoDisp = await this.prisma.estado_key.findFirst({
      where: { nombre: { equals: 'disponible', mode: 'insensitive' } },
    });
    const tipoComp = await this.prisma.tipo_transaccion.findFirst({
      where: { nombre: { equals: 'compra', mode: 'insensitive' } },
    });
    if (!estadoDisp || !tipoComp)
      throw new NotFoundException('Falta estado o tipo de transacción');

    // Transacción atómica
    const trans = await this.prisma.$transaction(async (tx) => {
      const t = await tx.transaccion.create({
        data: {
          id_usuario: adminId,
          id_tipo_transaccion: tipoComp.id_tipo_transaccion,
          monto: precioCompra * cantidad,
          descripcion: descripcion ?? 'Compra de keys',
        },
      });

      for (let i = 0; i < cantidad; i++) {
        let keyStr: string;
        do {
          keyStr = generarKey();
        } while (await tx.key.findUnique({ where: { key: keyStr } }));

        const nuevaKey = await tx.key.create({
          data: {
            id_juego: juegoId,
            key: keyStr,
            id_estado_key: estadoDisp.id_estado_key,
            id_proveedor: proveedorId,
            id_plataforma: plataformaId,
            precio_compra: precioCompra,
            precio_venta: precioVenta,
          },
        });

        await tx.transaccion_key.create({
          data: {
            id_transaccion: t.id_transaccion,
            id_key: nuevaKey.id_key,
          },
        });
        await tx.detalle_transaccion.create({
          data: {
            id_transaccion: t.id_transaccion,
            id_juego: juegoId,
            cantidad: 1,
            precio_unitario: precioCompra,
          },
        });

        // Actualizar contadores
        const total = await tx.key.count({ where: { id_juego: juegoId } });
        const disponibles = await tx.key.count({
          where: {
            id_juego: juegoId,
            id_estado_key: estadoDisp.id_estado_key,
          },
        });
        await tx.juego.update({
          where: { id_juego: juegoId },
          data: { cantidad: total, cantidad_disponible: disponibles },
        });
      }
      return t;
    });

    return { mensaje: 'Compra registrada', transaccion: trans };
  }
}

// Generador de keys único
function generarKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bloque = () =>
    Array.from(
      { length: 5 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
  return `${bloque()}-${bloque()}-${bloque()}-${bloque()}-${bloque()}`;
}
