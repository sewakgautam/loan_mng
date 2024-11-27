/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Dhitto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userId` to the `BankRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SaleUser` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Dhitto" DROP CONSTRAINT "Dhitto_customerId_fkey";

-- DropForeignKey
ALTER TABLE "DhittoAccumulation" DROP CONSTRAINT "DhittoAccumulation_dhittoId_fkey";

-- DropForeignKey
ALTER TABLE "DhittoStatement" DROP CONSTRAINT "DhittoStatement_dhittoId_fkey";

-- DropForeignKey
ALTER TABLE "Lilami" DROP CONSTRAINT "Lilami_dhittoId_fkey";

-- AlterTable
ALTER TABLE "BankRecord" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_pkey",
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Customer_id_seq";

-- AlterTable
ALTER TABLE "Dhitto" DROP CONSTRAINT "Dhitto_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "customerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Dhitto_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Dhitto_id_seq";

-- AlterTable
ALTER TABLE "DhittoAccumulation" ALTER COLUMN "dhittoId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "DhittoStatement" ALTER COLUMN "dhittoId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Lilami" ALTER COLUMN "dhittoId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SaleUser" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CLIENT';

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dhitto" ADD CONSTRAINT "Dhitto_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DhittoAccumulation" ADD CONSTRAINT "DhittoAccumulation_dhittoId_fkey" FOREIGN KEY ("dhittoId") REFERENCES "Dhitto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DhittoStatement" ADD CONSTRAINT "DhittoStatement_dhittoId_fkey" FOREIGN KEY ("dhittoId") REFERENCES "Dhitto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankRecord" ADD CONSTRAINT "BankRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleUser" ADD CONSTRAINT "SaleUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lilami" ADD CONSTRAINT "Lilami_dhittoId_fkey" FOREIGN KEY ("dhittoId") REFERENCES "Dhitto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
