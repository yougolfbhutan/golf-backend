/*
  Warnings:

  - You are about to drop the column `brings_own_clubs` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `caddieId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `caddie_requested` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `equipment_fee` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `golfCourseId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `handicap` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `id_number` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `noofrounds` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `roundTypeId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `skill_level` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the `bookingequipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `caddie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `carryset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `carryseturl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `golfcourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `peoplecategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roundtype` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `skillLevel` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_caddieId_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_golfCourseId_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_roundTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `bookingequipment` DROP FOREIGN KEY `BookingEquipment_bookingId_fkey`;

-- DropForeignKey
ALTER TABLE `bookingequipment` DROP FOREIGN KEY `BookingEquipment_carrySetId_fkey`;

-- DropForeignKey
ALTER TABLE `carryset` DROP FOREIGN KEY `CarrySet_caddieId_fkey`;

-- DropForeignKey
ALTER TABLE `carryset` DROP FOREIGN KEY `CarrySet_peopleCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `carryset` DROP FOREIGN KEY `CarrySet_roundTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `carryseturl` DROP FOREIGN KEY `CarrySetUrl_carrysetId_fkey`;

-- DropIndex
DROP INDEX `Booking_caddieId_idx` ON `booking`;

-- DropIndex
DROP INDEX `Booking_golfCourseId_play_date_idx` ON `booking`;

-- DropIndex
DROP INDEX `Booking_roundTypeId_idx` ON `booking`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `brings_own_clubs`,
    DROP COLUMN `caddieId`,
    DROP COLUMN `caddie_requested`,
    DROP COLUMN `equipment_fee`,
    DROP COLUMN `golfCourseId`,
    DROP COLUMN `handicap`,
    DROP COLUMN `id_number`,
    DROP COLUMN `noofrounds`,
    DROP COLUMN `roundTypeId`,
    DROP COLUMN `skill_level`,
    DROP COLUMN `totalPrice`,
    ADD COLUMN `items_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `sets_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `skillLevel` VARCHAR(191) NOT NULL,
    ADD COLUMN `total_price` DECIMAL(10, 2) NOT NULL,
    MODIFY `course_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `itemvariant` ADD COLUMN `audience` ENUM('men', 'women', 'junior') NULL,
    ADD COLUMN `hand` ENUM('left', 'right') NULL,
    ADD COLUMN `tier` ENUM('standard', 'premium') NULL;

-- DropTable
DROP TABLE `bookingequipment`;

-- DropTable
DROP TABLE `caddie`;

-- DropTable
DROP TABLE `carryset`;

-- DropTable
DROP TABLE `carryseturl`;

-- DropTable
DROP TABLE `golfcourse`;

-- DropTable
DROP TABLE `peoplecategory`;

-- DropTable
DROP TABLE `roundtype`;

-- CreateTable
CREATE TABLE `GolfSet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `tier` ENUM('standard', 'premium') NOT NULL DEFAULT 'standard',
    `handedness` ENUM('left', 'right') NOT NULL DEFAULT 'right',
    `audience` ENUM('men', 'women', 'junior') NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `availability` BOOLEAN NOT NULL DEFAULT true,

    INDEX `GolfSet_tier_handedness_audience_idx`(`tier`, `handedness`, `audience`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GolfSetUrl` (
    `url` VARCHAR(500) NOT NULL,
    `golfSetId` INTEGER NOT NULL,

    INDEX `GolfSetUrl_golfSetId_idx`(`golfSetId`),
    PRIMARY KEY (`url`, `golfSetId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingGolfSet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `golfSetId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `unitPrice` DECIMAL(10, 2) NOT NULL,

    INDEX `BookingGolfSet_golfSetId_idx`(`golfSetId`),
    UNIQUE INDEX `BookingGolfSet_bookingId_golfSetId_key`(`bookingId`, `golfSetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `itemVariantId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `unitPrice` DECIMAL(10, 2) NOT NULL,

    INDEX `BookingItem_itemVariantId_idx`(`itemVariantId`),
    UNIQUE INDEX `BookingItem_bookingId_itemVariantId_key`(`bookingId`, `itemVariantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Booking_play_date_idx` ON `Booking`(`play_date`);

-- CreateIndex
CREATE INDEX `ItemVariant_tier_idx` ON `ItemVariant`(`tier`);

-- CreateIndex
CREATE INDEX `ItemVariant_audience_idx` ON `ItemVariant`(`audience`);

-- AddForeignKey
ALTER TABLE `GolfSetUrl` ADD CONSTRAINT `GolfSetUrl_golfSetId_fkey` FOREIGN KEY (`golfSetId`) REFERENCES `GolfSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingGolfSet` ADD CONSTRAINT `BookingGolfSet_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingGolfSet` ADD CONSTRAINT `BookingGolfSet_golfSetId_fkey` FOREIGN KEY (`golfSetId`) REFERENCES `GolfSet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingItem` ADD CONSTRAINT `BookingItem_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingItem` ADD CONSTRAINT `BookingItem_itemVariantId_fkey` FOREIGN KEY (`itemVariantId`) REFERENCES `ItemVariant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
