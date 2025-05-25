/*
  Warnings:

  - You are about to drop the `jerarquia_suscripciones` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jerarquia` to the `juego_suscripcion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "jerarquia_suscripciones" DROP CONSTRAINT "jerarquia_suscripciones_id_hija_fkey";

-- DropForeignKey
ALTER TABLE "jerarquia_suscripciones" DROP CONSTRAINT "jerarquia_suscripciones_id_padre_fkey";

-- AlterTable
ALTER TABLE "juego_suscripcion" ADD COLUMN     "jerarquia" INTEGER NOT NULL;

-- DropTable
DROP TABLE "jerarquia_suscripciones";
