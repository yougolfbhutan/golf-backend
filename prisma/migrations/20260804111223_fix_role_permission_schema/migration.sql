/*
  Warnings:

  - You are about to drop the column `roleId` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `permissionId` on the `rolepermission` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `rolepermission` table. All the data in the column will be lost.
  - Added the required column `rolepermissionId` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerroleId` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rolepermissionId` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `customer` DROP FOREIGN KEY `Customer_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `rolepermission` DROP FOREIGN KEY `RolePermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `rolepermission` DROP FOREIGN KEY `RolePermission_roleId_fkey`;

-- DropIndex
DROP INDEX `Customer_roleId_fkey` ON `customer`;

-- DropIndex
DROP INDEX `RolePermission_permissionId_fkey` ON `rolepermission`;

-- DropIndex
DROP INDEX `RolePermission_roleId_permissionId_key` ON `rolepermission`;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `roleId`,
    ADD COLUMN `customerroleId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `permission` ADD COLUMN `rolepermissionId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `role` ADD COLUMN `customerroleId` INTEGER NOT NULL,
    ADD COLUMN `rolepermissionId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `rolepermission` DROP COLUMN `permissionId`,
    DROP COLUMN `roleId`;

-- CreateTable
CREATE TABLE `CustomerRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_customerroleId_fkey` FOREIGN KEY (`customerroleId`) REFERENCES `CustomerRole`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_customerroleId_fkey` FOREIGN KEY (`customerroleId`) REFERENCES `CustomerRole`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_rolepermissionId_fkey` FOREIGN KEY (`rolepermissionId`) REFERENCES `RolePermission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_rolepermissionId_fkey` FOREIGN KEY (`rolepermissionId`) REFERENCES `RolePermission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
