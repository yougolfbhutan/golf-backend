/*
  Warnings:

  - A unique constraint covering the columns `[bookingId,itemVariantId,isAddOn]` on the table `BookingItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `bookingitem` DROP FOREIGN KEY `BookingItem_bookingId_fkey`;

-- DropIndex
DROP INDEX `BookingItem_bookingId_itemVariantId_key` ON `bookingitem`;

-- AlterTable
ALTER TABLE `booking` ADD COLUMN `package_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `package_tier` ENUM('standard', 'premium') NULL;

-- AlterTable
ALTER TABLE `bookingitem` ADD COLUMN `isAddOn` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `golfset` ADD COLUMN `stockQty` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `itemcategory` ADD COLUMN `isAddOn` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `BookingItem_bookingId_itemVariantId_isAddOn_key` ON `BookingItem`(`bookingId`, `itemVariantId`, `isAddOn`);

-- AddForeignKey
ALTER TABLE `RolePermission` DROP FOREIGN KEY `RolePermission_permissionId_fkey`;
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
