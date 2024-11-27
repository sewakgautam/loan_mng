/*
  Warnings:

  - You are about to drop the `Sale` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Sale";

-- CreateTable
CREATE TABLE "SaleUser" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "panNo" TEXT NOT NULL,

    CONSTRAINT "SaleUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleGood" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buyerName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "saleUserId" INTEGER NOT NULL,

    CONSTRAINT "SaleGood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SaleGood_date_idx" ON "SaleGood" USING HASH ("date");

-- AddForeignKey
ALTER TABLE "SaleGood" ADD CONSTRAINT "SaleGood_saleUserId_fkey" FOREIGN KEY ("saleUserId") REFERENCES "SaleUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
