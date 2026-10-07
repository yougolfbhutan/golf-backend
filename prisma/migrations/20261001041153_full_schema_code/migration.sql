/*
  Warnings:

  - Made the column `carrySetId` on table `booking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_carrySetId_fkey`;

-- AlterTable
ALTER TABLE `booking` ADD COLUMN `orderId` INTEGER NULL,
    MODIFY `carrySetId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Booking_orderId_idx` ON `Booking`(`orderId`);

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_carrySetId_fkey` FOREIGN KEY (`carrySetId`) REFERENCES `CarrySet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
