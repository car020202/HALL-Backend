/*
  Warnings:

  - You are about to drop the column `precio` on the `key` table. All the data in the column will be lost.
  - Added the required column `precio_compra` to the `key` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio_venta` to the `key` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "key" DROP COLUMN "precio",
ADD COLUMN     "precio_compra" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "precio_venta" DECIMAL(10,2) NOT NULL;
