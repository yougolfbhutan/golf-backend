/*
  Warnings:

  - The values [cancelled,booked] on the enum `OauthAccountsTable_provider` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `oauthaccountstable` DROP FOREIGN KEY `OauthAccountsTable_userId_fkey`;

-- AlterTable
ALTER TABLE `oauthaccountstable` MODIFY `provider` ENUM('google', 'local') NOT NULL;

-- CreateTable
CREATE TABLE `SessionsTable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `valid` BOOLEAN NOT NULL DEFAULT true,
    `userAgent` VARCHAR(500) NOT NULL DEFAULT 'agent',
    `ip` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SessionsTable_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_id_fkey` FOREIGN KEY (`id`) REFERENCES `SessionsTable`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OauthAccountsTable` ADD CONSTRAINT `OauthAccountsTable_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
