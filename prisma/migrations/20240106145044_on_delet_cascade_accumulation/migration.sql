-- DropForeignKey
ALTER TABLE "DhittoAccumulation" DROP CONSTRAINT "DhittoAccumulation_dhittoId_fkey";

-- AddForeignKey
ALTER TABLE "DhittoAccumulation" ADD CONSTRAINT "DhittoAccumulation_dhittoId_fkey" FOREIGN KEY ("dhittoId") REFERENCES "Dhitto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
