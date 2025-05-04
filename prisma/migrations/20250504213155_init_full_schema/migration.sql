-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "amistad" (
    "id_amistad" SERIAL NOT NULL,
    "id_usuario_a" INTEGER NOT NULL,
    "id_usuario_b" INTEGER NOT NULL,

    CONSTRAINT "amistad_pkey" PRIMARY KEY ("id_amistad")
);

-- CreateTable
CREATE TABLE "biblioteca" (
    "id_biblioteca" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_biblioteca_detalle" INTEGER NOT NULL,

    CONSTRAINT "biblioteca_pkey" PRIMARY KEY ("id_biblioteca")
);

-- CreateTable
CREATE TABLE "biblioteca_detalle" (
    "id_biblioteca_detalle" SERIAL NOT NULL,
    "id_key" INTEGER NOT NULL,

    CONSTRAINT "biblioteca_detalle_pkey" PRIMARY KEY ("id_biblioteca_detalle")
);

-- CreateTable
CREATE TABLE "evento" (
    "id_evento" SERIAL NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "id_regalo_evento" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "categoria_juego" (
    "id_categoria_juego" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "categoria_juego_pkey" PRIMARY KEY ("id_categoria_juego")
);

-- CreateTable
CREATE TABLE "juego" (
    "id_juego" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_categoria_juego" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "cantidad_disponible" INTEGER NOT NULL,

    CONSTRAINT "juego_pkey" PRIMARY KEY ("id_juego")
);

-- CreateTable
CREATE TABLE "key" (
    "id_key" SERIAL NOT NULL,
    "id_juego" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "id_estado_key" INTEGER NOT NULL,
    "id_proveedor" INTEGER NOT NULL,

    CONSTRAINT "key_pkey" PRIMARY KEY ("id_key")
);

-- CreateTable
CREATE TABLE "estado_key" (
    "id_estado_key" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "estado_key_pkey" PRIMARY KEY ("id_estado_key")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id_proveedor" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "correo" TEXT NOT NULL,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "solicitud" (
    "id_solicitud" SERIAL NOT NULL,
    "id_solicitante" INTEGER NOT NULL,
    "id_receptor" INTEGER NOT NULL,
    "id_estado" INTEGER NOT NULL,
    "fecha_solicitud" TIMESTAMP(3) NOT NULL,
    "fecha_confirmacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitud_pkey" PRIMARY KEY ("id_solicitud")
);

-- CreateTable
CREATE TABLE "estado_solicitud" (
    "id_estado_solicitud" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "estado_solicitud_pkey" PRIMARY KEY ("id_estado_solicitud")
);

-- CreateTable
CREATE TABLE "transaccion" (
    "id_transaccion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_tipo_transaccion" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "transaccion_pkey" PRIMARY KEY ("id_transaccion")
);

-- CreateTable
CREATE TABLE "tipo_transaccion" (
    "id_tipo_transaccion" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "tipo_transaccion_pkey" PRIMARY KEY ("id_tipo_transaccion")
);

-- CreateTable
CREATE TABLE "detalle_transaccion" (
    "id_detalle_transaccion" SERIAL NOT NULL,
    "id_transaccion" INTEGER NOT NULL,
    "id_juego" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_transaccion_pkey" PRIMARY KEY ("id_detalle_transaccion")
);

-- CreateTable
CREATE TABLE "transaccion_key" (
    "id_transaccion_key" SERIAL NOT NULL,
    "id_transaccion" INTEGER NOT NULL,
    "id_key" INTEGER NOT NULL,

    CONSTRAINT "transaccion_key_pkey" PRIMARY KEY ("id_transaccion_key")
);

-- CreateTable
CREATE TABLE "suscripcion" (
    "id_suscripcion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_estado_suscripcion" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "id_tipo_suscripcion" INTEGER NOT NULL,

    CONSTRAINT "suscripcion_pkey" PRIMARY KEY ("id_suscripcion")
);

-- CreateTable
CREATE TABLE "tipo_suscripcion" (
    "id_tipo_suscripcion" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "tipo_suscripcion_pkey" PRIMARY KEY ("id_tipo_suscripcion")
);

-- CreateTable
CREATE TABLE "estado_suscripcion" (
    "id_estado_suscripcion" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "estado_suscripcion_pkey" PRIMARY KEY ("id_estado_suscripcion")
);

-- CreateTable
CREATE TABLE "juego_suscripcion" (
    "id_key_suscripcion" SERIAL NOT NULL,
    "id_tipo_suscripcion" INTEGER NOT NULL,
    "id_juego" INTEGER NOT NULL,

    CONSTRAINT "juego_suscripcion_pkey" PRIMARY KEY ("id_key_suscripcion")
);

-- CreateTable
CREATE TABLE "jerarquia_suscripciones" (
    "id_key_suscripcion" SERIAL NOT NULL,
    "id_padre" INTEGER NOT NULL,
    "id_hija" INTEGER NOT NULL,

    CONSTRAINT "jerarquia_suscripciones_pkey" PRIMARY KEY ("id_key_suscripcion")
);

-- CreateTable
CREATE TABLE "regalo_evento" (
    "id_regalo_evento" SERIAL NOT NULL,
    "id_juego" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "cantidad_disponible" INTEGER NOT NULL,

    CONSTRAINT "regalo_evento_pkey" PRIMARY KEY ("id_regalo_evento")
);

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amistad" ADD CONSTRAINT "amistad_id_usuario_a_fkey" FOREIGN KEY ("id_usuario_a") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amistad" ADD CONSTRAINT "amistad_id_usuario_b_fkey" FOREIGN KEY ("id_usuario_b") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biblioteca" ADD CONSTRAINT "biblioteca_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biblioteca" ADD CONSTRAINT "biblioteca_id_biblioteca_detalle_fkey" FOREIGN KEY ("id_biblioteca_detalle") REFERENCES "biblioteca_detalle"("id_biblioteca_detalle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biblioteca_detalle" ADD CONSTRAINT "biblioteca_detalle_id_key_fkey" FOREIGN KEY ("id_key") REFERENCES "key"("id_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_id_regalo_evento_fkey" FOREIGN KEY ("id_regalo_evento") REFERENCES "regalo_evento"("id_regalo_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "juego" ADD CONSTRAINT "juego_id_categoria_juego_fkey" FOREIGN KEY ("id_categoria_juego") REFERENCES "categoria_juego"("id_categoria_juego") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key" ADD CONSTRAINT "key_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "juego"("id_juego") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key" ADD CONSTRAINT "key_id_estado_key_fkey" FOREIGN KEY ("id_estado_key") REFERENCES "estado_key"("id_estado_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key" ADD CONSTRAINT "key_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud" ADD CONSTRAINT "solicitud_id_solicitante_fkey" FOREIGN KEY ("id_solicitante") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud" ADD CONSTRAINT "solicitud_id_receptor_fkey" FOREIGN KEY ("id_receptor") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud" ADD CONSTRAINT "solicitud_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estado_solicitud"("id_estado_solicitud") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaccion" ADD CONSTRAINT "transaccion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaccion" ADD CONSTRAINT "transaccion_id_tipo_transaccion_fkey" FOREIGN KEY ("id_tipo_transaccion") REFERENCES "tipo_transaccion"("id_tipo_transaccion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_transaccion" ADD CONSTRAINT "detalle_transaccion_id_transaccion_fkey" FOREIGN KEY ("id_transaccion") REFERENCES "transaccion"("id_transaccion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_transaccion" ADD CONSTRAINT "detalle_transaccion_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "juego"("id_juego") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaccion_key" ADD CONSTRAINT "transaccion_key_id_transaccion_fkey" FOREIGN KEY ("id_transaccion") REFERENCES "transaccion"("id_transaccion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaccion_key" ADD CONSTRAINT "transaccion_key_id_key_fkey" FOREIGN KEY ("id_key") REFERENCES "key"("id_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripcion" ADD CONSTRAINT "suscripcion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripcion" ADD CONSTRAINT "suscripcion_id_estado_suscripcion_fkey" FOREIGN KEY ("id_estado_suscripcion") REFERENCES "estado_suscripcion"("id_estado_suscripcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripcion" ADD CONSTRAINT "suscripcion_id_tipo_suscripcion_fkey" FOREIGN KEY ("id_tipo_suscripcion") REFERENCES "tipo_suscripcion"("id_tipo_suscripcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "juego_suscripcion" ADD CONSTRAINT "juego_suscripcion_id_tipo_suscripcion_fkey" FOREIGN KEY ("id_tipo_suscripcion") REFERENCES "tipo_suscripcion"("id_tipo_suscripcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "juego_suscripcion" ADD CONSTRAINT "juego_suscripcion_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "juego"("id_juego") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jerarquia_suscripciones" ADD CONSTRAINT "jerarquia_suscripciones_id_padre_fkey" FOREIGN KEY ("id_padre") REFERENCES "juego_suscripcion"("id_key_suscripcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jerarquia_suscripciones" ADD CONSTRAINT "jerarquia_suscripciones_id_hija_fkey" FOREIGN KEY ("id_hija") REFERENCES "juego_suscripcion"("id_key_suscripcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regalo_evento" ADD CONSTRAINT "regalo_evento_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "juego"("id_juego") ON DELETE RESTRICT ON UPDATE CASCADE;
