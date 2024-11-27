/*
  Warnings:

  - Made the column `userId` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dhittoId` on table `DhittoStatement` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_userId_fkey";

-- DropIndex
DROP INDEX "Customer_altPhoneNumber_key";

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "DhittoStatement" ALTER COLUMN "dhittoId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
