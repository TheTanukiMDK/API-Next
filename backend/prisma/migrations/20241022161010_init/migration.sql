/*
  Warnings:

  - Added the required column `stock` to the `Productos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productos` ADD COLUMN `stock` INTEGER NOT NULL;
