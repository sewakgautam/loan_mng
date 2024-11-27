/*
  Warnings:

  - You are about to drop the column `interest` on the `Dhitto` table. All the data in the column will be lost.
  - You are about to drop the column `principal` on the `Dhitto` table. All the data in the column will be lost.
  - You are about to drop the column `accumulatedInterest` on the `DhittoStatement` table. All the data in the column will be lost.
  - You are about to drop the column `accumulatedPrincipal` on the `DhittoStatement` table. All the data in the column will be lost.
  - Added the required column `interestPercentage` to the `Dhitto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `principalAmount` to the `Dhitto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dhitto" DROP COLUMN "interest",
DROP COLUMN "principal",
ADD COLUMN     "interestPercentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "principalAmount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "DhittoStatement" DROP COLUMN "accumulatedInterest",
DROP COLUMN "accumulatedPrincipal";

-- CreateTable
CREATE TABLE "DhittoAccumulation" (
    "id" SERIAL NOT NULL,
    "accPrincipal" DOUBLE PRECISION NOT NULL,
    "accInterest" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dhittoId" INTEGER NOT NULL,

    CONSTRAINT "DhittoAccumulation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DhittoAccumulation_dhittoId_key" ON "DhittoAccumulation"("dhittoId");

-- AddForeignKey
ALTER TABLE "DhittoAccumulation" ADD CONSTRAINT "DhittoAccumulation_dhittoId_fkey" FOREIGN KEY ("dhittoId") REFERENCES "Dhitto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
