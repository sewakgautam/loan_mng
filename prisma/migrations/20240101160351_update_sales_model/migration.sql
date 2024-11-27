/*
  Warnings:

  - You are about to drop the column `amount` on the `SaleGood` table. All the data in the column will be lost.
  - You are about to drop the column `finalWeight` on the `SaleGood` table. All the data in the column will be lost.
  - You are about to drop the column `mfgLoss` on the `SaleGood` table. All the data in the column will be lost.
  - You are about to drop the column `stoneCharge` on the `SaleGood` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `SaleGood` table. All the data in the column will be lost.
  - Added the required column `makingCharge` to the `SaleGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mfgCost` to the `SaleGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `SaleGood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaleGood" DROP COLUMN "amount",
DROP COLUMN "finalWeight",
DROP COLUMN "mfgLoss",
DROP COLUMN "stoneCharge",
DROP COLUMN "totalAmount",
ADD COLUMN     "makingCharge" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mfgCost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;
