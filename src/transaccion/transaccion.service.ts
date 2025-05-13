import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface SaleParams {
  userId: number;
  keys: number[]; // [id_key1, id_key2, …]
  descripcion?: string;
}

@Injectable()
export class TransaccionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registra la venta de una o varias keys por parte de un usuario.
   * Crea la transacción, asigna detalle y marca cada key como "vendida".
   */
  async processSale({ userId, keys, descripcion }: SaleParams) {
    // 1) Obtener datos de las keys
    const keyRecords = await this.prisma.key.findMany({
      where: { id_key: { in: keys } },
      select: { id_key: true, precio: true, id_juego: true },
    });
    if (keyRecords.length !== keys.length) {
      throw new NotFoundException('Alguna de las keys no existe');
    }

    // 2) Calcular monto total
    const monto = keyRecords.reduce((sum, k) => sum + Number(k.precio), 0);

    // 3) Cargar estado "vendida" y "disponible" (para recálculo de contadores)
    const [estadoVend, estadoDisp] = await Promise.all([
      this.prisma.estado_key.findFirst({ where: { nombre: 'vendida' } }),
      this.prisma.estado_key.findFirst({ where: { nombre: 'disponible' } }),
    ]);
    if (!estadoVend)
      throw new NotFoundException('No existe el estado "vendida"');
    if (!estadoDisp)
      throw new NotFoundException('No existe el estado "disponible"');

    // 4) Ejecutar en transacción atómica
    const trans = await this.prisma.$transaction(async (tx) => {
      // a) Crear cabecera de la transacción (tipo = 2 → venta)
      const t = await tx.transaccion.create({
        data: {
          id_usuario: userId,
          id_tipo_transaccion: 2,
          monto,
          descripcion: descripcion ?? 'Venta de keys al usuario',
        },
      });

      // b) Procesar cada key: detalle y cambio de estado
      for (const k of keyRecords) {
        // insertar en transaccion_key
        await tx.transaccion_key.create({
          data: {
            id_transaccion: t.id_transaccion,
            id_key: k.id_key,
          },
        });
        // insertar en detalle_transaccion
        await tx.detalle_transaccion.create({
          data: {
            id_transaccion: t.id_transaccion,
            id_juego: k.id_juego,
            cantidad: 1,
            precio_unitario: k.precio,
          },
        });
        // marcar la key como "vendida"
        await tx.key.update({
          where: { id_key: k.id_key },
          data: { id_estado_key: estadoVend.id_estado_key },
        });
        // recalcular contadores en juego
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

    return {
      mensaje: 'Venta registrada',
      transaccion: trans,
    };
  }
}
