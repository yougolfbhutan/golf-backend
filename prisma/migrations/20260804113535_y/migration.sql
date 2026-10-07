/*
  Warnings:

  - You are about to drop the column `customerroleId` on the `customer` table. All the data in the column will be lost.
  - The primary key for the `customerrole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `customerrole` table. All the data in the column will be lost.
  - You are about to drop the column `customerroleId` on the `role` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `CustomerRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `CustomerRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `customer` DROP FOREIGN KEY `Customer_customerroleId_fkey`;

-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `Role_customerroleId_fkey`;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `customerroleId`;

-- AlterTable
ALTER TABLE `customerrole` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `customerId` INTEGER NOT NULL,
    ADD COLUMN `roleId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`customerId`, `roleId`);

-- AlterTable
ALTER TABLE `role` DROP COLUMN `customerroleId`;

-- AddForeignKey
ALTER TABLE `CustomerRole` ADD CONSTRAINT `CustomerRole_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerRole` ADD CONSTRAINT `CustomerRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
