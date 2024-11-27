/*
  Warnings:

  - You are about to drop the column `buyerName` on the `SaleGood` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `SaleGood` table. All the data in the column will be lost.
  - Added the required column `amount` to the `SaleGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalWeight` to the `SaleGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mfgLoss` to the `SaleGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stoneCharge` to the `SaleGood` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SaleGood_date_idx";

-- AlterTable
ALTER TABLE "SaleGood" DROP COLUMN "buyerName",
DROP COLUMN "date",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "finalWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mfgLoss" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "stoneCharge" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "SaleUser" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "SaleUser_date_idx" ON "SaleUser" USING HASH ("date");
