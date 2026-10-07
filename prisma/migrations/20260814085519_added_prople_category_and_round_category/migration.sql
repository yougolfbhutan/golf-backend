/*
  Warnings:

  - Added the required column `peopleCategoryId` to the `CarrySet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roundTypeId` to the `CarrySet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `carryset` ADD COLUMN `peopleCategoryId` INTEGER NOT NULL,
    ADD COLUMN `roundTypeId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `PeopleCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `peoplecategoryname` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoundType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roundname` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CarrySet` ADD CONSTRAINT `CarrySet_peopleCategoryId_fkey` FOREIGN KEY (`peopleCategoryId`) REFERENCES `PeopleCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CarrySet` ADD CONSTRAINT `CarrySet_roundTypeId_fkey` FOREIGN KEY (`roundTypeId`) REFERENCES `RoundType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
