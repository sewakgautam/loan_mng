/*
  Warnings:

  - Added the required column `bsDate` to the `BankRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bsDate` to the `Dhitto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interest` to the `DhittoStatement` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DhittoStatus" AS ENUM ('LILAMI', 'SAFE');

-- AlterTable
ALTER TABLE "BankRecord" ADD COLUMN     "bsDate" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Dhitto" ADD COLUMN     "bsDate" TEXT NOT NULL,
ADD COLUMN     "status" "DhittoStatus" NOT NULL DEFAULT 'SAFE';

-- AlterTable
ALTER TABLE "DhittoStatement" ADD COLUMN     "bsDate" TEXT,
ADD COLUMN     "interest" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "SaleUser" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "panNo" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bsDate" TEXT NOT NULL,

    CONSTRAINT "SaleUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleGood" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "makingCharge" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "mfgCost" DOUBLE PRECISION NOT NULL,
    "saleUserId" INTEGER NOT NULL,

    CONSTRAINT "SaleGood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lilami" (
    "id" SERIAL NOT NULL,
    "dhittoId" INTEGER NOT NULL,

    CONSTRAINT "Lilami_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SaleUser_date_idx" ON "SaleUser" USING HASH ("date");

-- CreateIndex
CREATE UNIQUE INDEX "Lilami_dhittoId_key" ON "Lilami"("dhittoId");

-- AddForeignKey
ALTER TABLE "SaleGood" ADD CONSTRAINT "SaleGood_saleUserId_fkey" FOREIGN KEY ("saleUserId") REFERENCES "SaleUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lilami" ADD CONSTRAINT "Lilami_dhittoId_fkey" FOREIGN KEY ("dhittoId") REFERENCES "Dhitto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
