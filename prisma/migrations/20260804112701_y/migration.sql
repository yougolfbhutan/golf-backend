/*
  Warnings:

  - You are about to drop the column `rolepermissionId` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the column `rolepermissionId` on the `role` table. All the data in the column will be lost.
  - The primary key for the `rolepermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `rolepermission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[permission_name]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[role_name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `permissionId` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `RolePermission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `permission` DROP FOREIGN KEY `Permission_rolepermissionId_fkey`;

-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `Role_rolepermissionId_fkey`;

-- AlterTable
ALTER TABLE `permission` DROP COLUMN `rolepermissionId`;

-- AlterTable
ALTER TABLE `role` DROP COLUMN `rolepermissionId`;

-- AlterTable
ALTER TABLE `rolepermission` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `permissionId` INTEGER NOT NULL,
    ADD COLUMN `roleId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`roleId`, `permissionId`);

-- CreateIndex
CREATE UNIQUE INDEX `Permission_permission_name_key` ON `Permission`(`permission_name`);

-- CreateIndex
CREATE UNIQUE INDEX `Role_role_name_key` ON `Role`(`role_name`);

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
