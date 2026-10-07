/*
  Warnings:

  - A unique constraint covering the columns `[bookingKey]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Booking_tee_time_key` ON `booking`;

-- AlterTable
ALTER TABLE `booking` ADD COLUMN `bookingKey` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_bookingKey_key` ON `Booking`(`bookingKey`);
