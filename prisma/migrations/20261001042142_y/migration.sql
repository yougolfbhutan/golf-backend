/*
  Warnings:

  - You are about to drop the column `carrySetId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_carrySetId_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_orderId_fkey`;

-- DropIndex
DROP INDEX `Booking_carrySetId_idx` ON `booking`;

-- DropIndex
DROP INDEX `Booking_orderId_idx` ON `booking`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `carrySetId`,
    DROP COLUMN `orderId`;
