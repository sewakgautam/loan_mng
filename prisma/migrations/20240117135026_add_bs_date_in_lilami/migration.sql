/*
  Warnings:

  - Added the required column `bsDate` to the `Lilami` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lilami" ADD COLUMN     "bsDate" TEXT NOT NULL;
