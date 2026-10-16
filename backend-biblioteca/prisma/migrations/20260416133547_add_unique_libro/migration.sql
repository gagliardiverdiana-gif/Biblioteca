/*
  Warnings:

  - A unique constraint covering the columns `[titolo,autore]` on the table `Libro` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Libro_titolo_autore_key` ON `Libro`(`titolo`, `autore`);
