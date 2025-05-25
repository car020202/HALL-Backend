/*
  Warnings:

  - You are about to drop the column `estado` on the `evento` table. All the data in the column will be lost.
  - Added the required column `id_evento_estado` to the `evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "evento" DROP COLUMN "estado",
ADD COLUMN     "id_evento_estado" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "evento_estado" (
    "id_evento_estado" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "evento_estado_pkey" PRIMARY KEY ("id_evento_estado")
);

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_id_evento_estado_fkey" FOREIGN KEY ("id_evento_estado") REFERENCES "evento_estado"("id_evento_estado") ON DELETE RESTRICT ON UPDATE CASCADE;
