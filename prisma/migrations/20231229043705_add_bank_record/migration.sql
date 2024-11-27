-- CreateEnum
CREATE TYPE "BankRecordStatus" AS ENUM ('ON_BANK', 'RECEIVED');

-- CreateTable
CREATE TABLE "BankRecord" (
    "id" SERIAL NOT NULL,
    "bankName" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "BankRecordStatus" NOT NULL,

    CONSTRAINT "BankRecord_pkey" PRIMARY KEY ("id")
);
