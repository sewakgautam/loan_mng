/*
  Warnings:

  - Added the required column `image` to the `Lilami` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `Lilami` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remarks` to the `Lilami` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lilami" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "rate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "remarks" TEXT NOT NULL;
