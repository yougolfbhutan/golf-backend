/*
  Warnings:

  - You are about to alter the column `partyPhone` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `method` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Enum(EnumId(6))`.
  - You are about to alter the column `status` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Enum(EnumId(7))`.
  - A unique constraint covering the columns `[reference]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gatewayTxnId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `course_fee` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `play_date` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_type` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Made the column `partyName` on table `booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `partyEmail` on table `booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `golfCourseId` on table `booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `noofrounds` on table `booking` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `currency` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `accounttransaction` DROP FOREIGN KEY `AccountTransaction_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_golfCourseId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_bookingId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_orderId_fkey`;

-- DropIndex
DROP INDEX `Booking_golfCourseId_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Payment_bookingId_key` ON `payment`;

-- AlterTable
ALTER TABLE `booking` ADD COLUMN `brings_own_clubs` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `caddieId` INTEGER NULL,
    ADD COLUMN `caddie_requested` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `course_fee` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `currency` CHAR(3) NOT NULL,
    ADD COLUMN `equipment_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `handicap` DECIMAL(4, 1) NULL,
    ADD COLUMN `id_number` VARCHAR(50) NULL,
    ADD COLUMN `nationality` VARCHAR(100) NULL,
    ADD COLUMN `play_date` DATE NOT NULL,
    ADD COLUMN `player_type` ENUM('local', 'international') NOT NULL,
    ADD COLUMN `reference` VARCHAR(20) NOT NULL,
    ADD COLUMN `roundTypeId` INTEGER NULL,
    ADD COLUMN `skill_level` ENUM('beginner', 'intermediate', 'advanced') NULL,
    MODIFY `partyName` VARCHAR(255) NOT NULL,
    MODIFY `partyEmail` VARCHAR(100) NOT NULL,
    MODIFY `partyPhone` VARCHAR(50) NULL,
    MODIFY `golfCourseId` INTEGER NOT NULL,
    MODIFY `noofrounds` INTEGER NOT NULL DEFAULT 1,
    MODIFY `tee_time` DATETIME(3) NULL,
    MODIFY `specialRequest` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `carryset` ADD COLUMN `price` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `golfcourse` ADD COLUMN `priceInternational` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `cardLast4` CHAR(4) NULL,
    ADD COLUMN `currency` CHAR(3) NOT NULL,
    ADD COLUMN `gatewayTxnId` VARCHAR(100) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `method` ENUM('dk_bank', 'card') NOT NULL,
    MODIFY `status` ENUM('pending', 'success', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    MODIFY `journal_no` VARCHAR(50) NULL,
    MODIFY `payment_date` DATETIME(3) NULL,
    MODIFY `reference_no` VARCHAR(50) NULL;

-- CreateTable
CREATE TABLE `BookingEquipment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `carrySetId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `unitPrice` DECIMAL(10, 2) NOT NULL,

    INDEX `BookingEquipment_carrySetId_idx`(`carrySetId`),
    UNIQUE INDEX `BookingEquipment_bookingId_carrySetId_key`(`bookingId`, `carrySetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_reference_key` ON `Booking`(`reference`);

-- CreateIndex
CREATE INDEX `Booking_golfCourseId_play_date_idx` ON `Booking`(`golfCourseId`, `play_date`);

-- CreateIndex
CREATE INDEX `Booking_partyEmail_idx` ON `Booking`(`partyEmail`);

-- CreateIndex
CREATE INDEX `Booking_roundTypeId_idx` ON `Booking`(`roundTypeId`);

-- CreateIndex
CREATE INDEX `Booking_caddieId_idx` ON `Booking`(`caddieId`);

-- CreateIndex
CREATE UNIQUE INDEX `Payment_gatewayTxnId_key` ON `Payment`(`gatewayTxnId`);

-- CreateIndex
CREATE INDEX `Payment_bookingId_idx` ON `Payment`(`bookingId`);

-- CreateIndex
CREATE INDEX `Payment_status_idx` ON `Payment`(`status`);

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_golfCourseId_fkey` FOREIGN KEY (`golfCourseId`) REFERENCES `GolfCourse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_roundTypeId_fkey` FOREIGN KEY (`roundTypeId`) REFERENCES `RoundType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_caddieId_fkey` FOREIGN KEY (`caddieId`) REFERENCES `Caddie`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingEquipment` ADD CONSTRAINT `BookingEquipment_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingEquipment` ADD CONSTRAINT `BookingEquipment_carrySetId_fkey` FOREIGN KEY (`carrySetId`) REFERENCES `CarrySet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountTransaction` ADD CONSTRAINT `AccountTransaction_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
