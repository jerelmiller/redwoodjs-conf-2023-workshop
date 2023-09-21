/*
  Warnings:

  - A unique constraint covering the columns `[name,type,userId]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Device_name_type_userId_key" ON "Device"("name", "type", "userId");
