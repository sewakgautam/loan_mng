/*
  Warnings:

  - You are about to drop the column `bankName` on the `BankRecord` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `BankRecord` table. All the data in the column will be lost.
  - Added the required column `bankId` to the `BankRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `claimCode` to the `BankRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankRecord" DROP CONSTRAINT "BankRecord_userId_fkey";

-- AlterTable
ALTER TABLE "BankRecord" DROP COLUMN "bankName",
DROP COLUMN "userId",
ADD COLUMN     "bankId" TEXT NOT NULL,
ADD COLUMN     "claimCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankRecord" ADD CONSTRAINT "BankRecord_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;
