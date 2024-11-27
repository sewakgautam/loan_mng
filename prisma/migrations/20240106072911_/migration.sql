/*
  Warnings:

  - You are about to drop the `SaleGood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SaleUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SaleGood" DROP CONSTRAINT "SaleGood_saleUserId_fkey";

-- DropTable
DROP TABLE "SaleGood";

-- DropTable
DROP TABLE "SaleUser";
