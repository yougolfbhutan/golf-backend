/*
  Warnings:

  - You are about to drop the column `availibility` on the `caddie` table. All the data in the column will be lost.
  - You are about to drop the column `availibility` on the `carryset` table. All the data in the column will be lost.
  - You are about to drop the column `carrysettname` on the `carryset` table. All the data in the column will be lost.
  - The primary key for the `carryseturl` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `booking_golf_course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `caddieurl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `golf_course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `oauthaccountstable` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[roleId,permissionId]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cidNo` to the `Caddie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Caddie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `caddieId` to the `CarrySet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carrysetname` to the `CarrySet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking_golf_course` DROP FOREIGN KEY `Booking_Golf_Course_carrySetId_fkey`;

-- DropForeignKey
ALTER TABLE `booking_golf_course` DROP FOREIGN KEY `Booking_Golf_Course_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `booking_golf_course` DROP FOREIGN KEY `Booking_Golf_Course_golfCourseId_fkey`;

-- DropForeignKey
ALTER TABLE `caddieurl` DROP FOREIGN KEY `CaddieUrl_caddieId_fkey`;

-- DropForeignKey
ALTER TABLE `oauthaccountstable` DROP FOREIGN KEY `OauthAccountsTable_userId_fkey`;

-- AlterTable
ALTER TABLE `caddie` DROP COLUMN `availibility`,
    ADD COLUMN `cidNo` VARCHAR(50) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(20) NOT NULL,
    MODIFY `caddiename` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `carryset` DROP COLUMN `availibility`,
    DROP COLUMN `carrysettname`,
    ADD COLUMN `availability` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `caddieId` INTEGER NOT NULL,
    ADD COLUMN `carrysetname` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `carryseturl` DROP PRIMARY KEY,
    MODIFY `url` VARCHAR(500) NOT NULL,
    ADD PRIMARY KEY (`url`, `carrysetId`);

-- DropTable
DROP TABLE `booking_golf_course`;

-- DropTable
DROP TABLE `caddieurl`;

-- DropTable
DROP TABLE `golf_course`;

-- DropTable
DROP TABLE `oauthaccountstable`;

-- CreateTable
CREATE TABLE `OauthAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider` ENUM('google', 'local') NOT NULL,
    `providerAccountId` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerId` INTEGER NOT NULL,

    UNIQUE INDEX `OauthAccount_providerAccountId_key`(`providerAccountId`),
    UNIQUE INDEX `OauthAccount_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `status` ENUM('pending', 'booked', 'cancelled') NOT NULL DEFAULT 'pending',
    `price` DECIMAL(10, 2) NOT NULL,
    `customerId` INTEGER NULL,
    `partyName` VARCHAR(255) NULL,
    `partyEmail` VARCHAR(100) NULL,
    `partyPhone` VARCHAR(100) NULL,
    `golfCourse` VARCHAR(255) NOT NULL,
    `carrySetId` INTEGER NULL,
    `orderId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `stockQty` INTEGER NOT NULL DEFAULT 0,
    `availability` BOOLEAN NOT NULL DEFAULT true,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `cartId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,

    UNIQUE INDEX `CartItem_cartId_itemId_key`(`cartId`, `itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('pending', 'paid', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
    `totalPrice` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerId` INTEGER NOT NULL,
    `cartId` INTEGER NULL,

    UNIQUE INDEX `Order_cartId_key`(`cartId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DECIMAL(10, 2) NOT NULL,
    `method` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `orderId` INTEGER NOT NULL,

    UNIQUE INDEX `Payment_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `RolePermission_roleId_permissionId_key` ON `RolePermission`(`roleId`, `permissionId`);

-- AddForeignKey
ALTER TABLE `OauthAccount` ADD CONSTRAINT `OauthAccount_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_carrySetId_fkey` FOREIGN KEY (`carrySetId`) REFERENCES `CarrySet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CarrySet` ADD CONSTRAINT `CarrySet_caddieId_fkey` FOREIGN KEY (`caddieId`) REFERENCES `Caddie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ItemCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
