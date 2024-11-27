/*
  Warnings:

  - The primary key for the `BankRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DhittoAccumulation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DhittoStatement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Lilami` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SaleUser` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "SaleGood" DROP CONSTRAINT "SaleGood_saleUserId_fkey";

-- AlterTable
ALTER TABLE "BankRecord" DROP CONSTRAINT "BankRecord_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BankRecord_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BankRecord_id_seq";

-- AlterTable
ALTER TABLE "DhittoAccumulation" DROP CONSTRAINT "DhittoAccumulation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "DhittoAccumulation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DhittoAccumulation_id_seq";

-- AlterTable
ALTER TABLE "DhittoStatement" DROP CONSTRAINT "DhittoStatement_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "DhittoStatement_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DhittoStatement_id_seq";

-- AlterTable
ALTER TABLE "Lilami" DROP CONSTRAINT "Lilami_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Lilami_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Lilami_id_seq";

-- AlterTable
ALTER TABLE "SaleGood" ALTER COLUMN "saleUserId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SaleUser" DROP CONSTRAINT "SaleUser_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SaleUser_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SaleUser_id_seq";

-- AddForeignKey
ALTER TABLE "SaleGood" ADD CONSTRAINT "SaleGood_saleUserId_fkey" FOREIGN KEY ("saleUserId") REFERENCES "SaleUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
