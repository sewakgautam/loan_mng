-- DropForeignKey
ALTER TABLE "Dhitto" DROP CONSTRAINT "Dhitto_customerId_fkey";

-- DropForeignKey
ALTER TABLE "DhittoStatement" DROP CONSTRAINT "DhittoStatement_dhittoId_fkey";

-- AddForeignKey
ALTER TABLE "Dhitto" ADD CONSTRAINT "Dhitto_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DhittoStatement" ADD CONSTRAINT "DhittoStatement_dhittoId_fkey" FOREIGN KEY ("dhittoId") REFERENCES "Dhitto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
