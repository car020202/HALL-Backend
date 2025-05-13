import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1) Estado de keys
  await prisma.estado_key.createMany({
    data: [
      { nombre: 'disponible' },
      { nombre: 'vendida' },
      { nombre: 'reservada' },
    ],
    skipDuplicates: true,
  });

  // 2) Estado de solicitudes
  await prisma.estado_solicitud.createMany({
    data: [
      { nombre: 'pendiente' },
      { nombre: 'aceptada' },
      { nombre: 'rechazada' },
    ],
    skipDuplicates: true,
  });

  // 3) Tipos de transacción
  await prisma.tipo_transaccion.createMany({
    data: [{ nombre: 'compra' }, { nombre: 'venta' }, { nombre: 'devolución' }],
    skipDuplicates: true,
  });

  // 4) Tipos de suscripción
  await prisma.tipo_suscripcion.createMany({
    data: [
      { nombre: 'Plus', precio: new Prisma.Decimal(2.99) },
      { nombre: 'Premium', precio: new Prisma.Decimal(4.99) },
      { nombre: 'Deluxe', precio: new Prisma.Decimal(9.99) },
    ],
    skipDuplicates: true,
  });

  // 5) Estado de suscripción
  await prisma.estado_suscripcion.createMany({
    data: [
      { nombre: 'activa' },
      { nombre: 'expirada' },
      { nombre: 'cancelada' },
    ],
    skipDuplicates: true,
  });

  // 6) Roles por defecto
  await prisma.rol.createMany({
    data: [{ nombre: 'Administrador' }, { nombre: 'Usuario' }],
    skipDuplicates: true,
  });

  // 7) Plataformas por defecto
  await prisma.plataforma.createMany({
    data: [
      { nombre: 'PlayStation' },
      { nombre: 'Xbox' },
      { nombre: 'Nintendo' },
      { nombre: 'PC' },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
