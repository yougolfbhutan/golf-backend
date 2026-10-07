/*
  Warnings:

  - You are about to drop the column `login_type` on the `customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customer` DROP COLUMN `login_type`;

-- CreateTable
CREATE TABLE `OauthAccountsTable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider` ENUM('cancelled', 'booked') NOT NULL,
    `userId` INTEGER NOT NULL,
    `providerAccountId` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `OauthAccountsTable_userId_key`(`userId`),
    UNIQUE INDEX `OauthAccountsTable_providerAccountId_key`(`providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OauthAccountsTable` ADD CONSTRAINT `OauthAccountsTable_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
