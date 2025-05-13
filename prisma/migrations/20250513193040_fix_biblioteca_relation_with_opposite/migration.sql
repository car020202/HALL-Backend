/*
  Warnings:

  - You are about to drop the column `id_biblioteca_detalle` on the `biblioteca` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_biblioteca]` on the table `biblioteca_detalle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_biblioteca` to the `biblioteca_detalle` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "biblioteca" DROP CONSTRAINT "biblioteca_id_biblioteca_detalle_fkey";

-- AlterTable
ALTER TABLE "biblioteca" DROP COLUMN "id_biblioteca_detalle";

-- AlterTable
ALTER TABLE "biblioteca_detalle" ADD COLUMN     "id_biblioteca" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "biblioteca_detalle_id_biblioteca_key" ON "biblioteca_detalle"("id_biblioteca");

-- AddForeignKey
ALTER TABLE "biblioteca_detalle" ADD CONSTRAINT "biblioteca_detalle_id_biblioteca_fkey" FOREIGN KEY ("id_biblioteca") REFERENCES "biblioteca"("id_biblioteca") ON DELETE RESTRICT ON UPDATE CASCADE;
