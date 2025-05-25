/*
  Warnings:

  - You are about to drop the column `jerarquia` on the `juego_suscripcion` table. All the data in the column will be lost.
  - Added the required column `semana_global` to the `juego_suscripcion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "juego_suscripcion" DROP COLUMN "jerarquia",
ADD COLUMN     "semana_global" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "configuracion" (
    "id_configuracion" SERIAL NOT NULL,
    "semana_global" INTEGER NOT NULL,

    CONSTRAINT "configuracion_pkey" PRIMARY KEY ("id_configuracion")
);
