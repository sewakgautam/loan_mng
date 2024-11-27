-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "altPhoneNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dhitto" (
    "id" SERIAL NOT NULL,
    "principal" DOUBLE PRECISION NOT NULL,
    "interest" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productName" TEXT NOT NULL,
    "customerId" INTEGER,

    CONSTRAINT "Dhitto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phoneNumber_key" ON "Customer"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_altPhoneNumber_key" ON "Customer"("altPhoneNumber");

-- AddForeignKey
ALTER TABLE "Dhitto" ADD CONSTRAINT "Dhitto_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
