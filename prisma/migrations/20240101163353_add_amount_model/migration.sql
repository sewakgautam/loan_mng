/*
  Warnings:

  - Added the required column `amount` to the `SaleGood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaleGood" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;
