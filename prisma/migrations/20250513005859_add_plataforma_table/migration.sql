/*
  Warnings:

  - Added the required column `id_plataforma` to the `key` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "key" ADD COLUMN     "id_plataforma" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "plataforma" (
    "id_plataforma" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "plataforma_pkey" PRIMARY KEY ("id_plataforma")
);

-- CreateIndex
CREATE UNIQUE INDEX "plataforma_nombre_key" ON "plataforma"("nombre");

-- AddForeignKey
ALTER TABLE "key" ADD CONSTRAINT "key_id_plataforma_fkey" FOREIGN KEY ("id_plataforma") REFERENCES "plataforma"("id_plataforma") ON DELETE RESTRICT ON UPDATE CASCADE;
