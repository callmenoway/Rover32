/*
  Warnings:

  - A unique constraint covering the columns `[macAddress]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `macAddress` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "controlHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "kilometersDriven" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "macAddress" TEXT NOT NULL,
ADD COLUMN     "uptimeHours" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "VehicleStats" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "uptimeHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "controlHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "kilometersDriven" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vehicleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsed" TIMESTAMP(3),

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VehicleStats_vehicleId_idx" ON "VehicleStats"("vehicleId");

-- CreateIndex
CREATE INDEX "VehicleStats_date_idx" ON "VehicleStats"("date");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleStats_vehicleId_date_key" ON "VehicleStats"("vehicleId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_macAddress_key" ON "Vehicle"("macAddress");

-- AddForeignKey
ALTER TABLE "VehicleStats" ADD CONSTRAINT "VehicleStats_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
