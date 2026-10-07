/*
  Warnings:

  - You are about to drop the column `golfCourse` on the `booking` table. All the data in the column will be lost.
  - Added the required column `golfCourseId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `golfCourse`,
    ADD COLUMN `golfCourseId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `cartitem` ADD COLUMN `unitPrice` DECIMAL(10, 2) NOT NULL;

-- CreateTable
CREATE TABLE `GolfCourse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_golfCourseId_fkey` FOREIGN KEY (`golfCourseId`) REFERENCES `GolfCourse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
