-- AlterTable
ALTER TABLE "Dhitto" ADD COLUMN     "conversionPeriod" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "DhittoStatement" (
    "id" SERIAL NOT NULL,
    "remark" TEXT NOT NULL,
    "debit" DOUBLE PRECISION NOT NULL,
    "credit" DOUBLE PRECISION NOT NULL,
    "accumulatedInterest" DOUBLE PRECISION NOT NULL,
    "accumulatedPrincipal" DOUBLE PRECISION NOT NULL,
    "dhittoId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DhittoStatement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DhittoStatement" ADD CONSTRAINT "DhittoStatement_dhittoId_fkey" FOREIGN KEY ("dhittoId") REFERENCES "Dhitto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
