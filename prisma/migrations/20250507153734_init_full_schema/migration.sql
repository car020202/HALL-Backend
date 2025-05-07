/*
  Warnings:

  - A unique constraint covering the columns `[id_usuario_a,id_usuario_b]` on the table `amistad` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "unique_amistad" ON "amistad"("id_usuario_a", "id_usuario_b");
