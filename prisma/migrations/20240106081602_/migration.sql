-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
    "principalAmount" DOUBLE PRECISION NOT NULL,
    "interestPercentage" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productName" TEXT NOT NULL,
    "customerId" INTEGER,
    "conversionPeriod" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dhitto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DhittoAccumulation" (
    "id" SERIAL NOT NULL,
    "accPrincipal" DOUBLE PRECISION NOT NULL,
    "accInterest" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dhittoId" INTEGER NOT NULL,

    CONSTRAINT "DhittoAccumulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DhittoStatement" (
    "id" SERIAL NOT NULL,
    "remark" TEXT NOT NULL,
    "debit" DOUBLE PRECISION NOT NULL,
    "credit" DOUBLE PRECISION NOT NULL,
    "dhittoId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DhittoStatement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phoneNumber_key" ON "Customer"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_altPhoneNumber_key" ON "Customer"("altPhoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DhittoAccumulation_dhittoId_key" ON "DhittoAccumulation"("dhittoId");

-- AddForeignKey
ALTER TABLE "Dhitto" ADD CONSTRAINT "Dhitto_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DhittoAccumulation" ADD CONSTRAINT "DhittoAccumulation_dhittoId_fkey" FOREIGN KEY ("dhittoId") REFERENCES "Dhitto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DhittoStatement" ADD CONSTRAINT "DhittoStatement_dhittoId_fkey" FOREIGN KEY ("dhittoId") REFERENCES "Dhitto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
