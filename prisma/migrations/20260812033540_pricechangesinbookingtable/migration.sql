/*
  Warnings:

  - You are about to drop the column `price` on the `booking` table. All the data in the column will be lost.
  - Added the required column `journal_no` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_date` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference_no` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `price`;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `journal_no` VARCHAR(50) NOT NULL,
    ADD COLUMN `payment_date` DATETIME(3) NOT NULL,
    ADD COLUMN `reference_no` VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE `AccountTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voucher_no` VARCHAR(50) NOT NULL,
    `voucher_amount` DECIMAL(10, 2) NOT NULL,
    `voucher` VARCHAR(50) NOT NULL,
    `paymentId` INTEGER NOT NULL,

    UNIQUE INDEX `AccountTransaction_paymentId_key`(`paymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccountTransactionDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference_no` VARCHAR(50) NOT NULL,
    `dr` DECIMAL(10, 2) NOT NULL,
    `cr` DECIMAL(10, 2) NOT NULL,
    `accountType` VARCHAR(50) NOT NULL,
    `accountTransactionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccountTransaction` ADD CONSTRAINT `AccountTransaction_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountTransactionDetails` ADD CONSTRAINT `AccountTransactionDetails_accountTransactionId_fkey` FOREIGN KEY (`accountTransactionId`) REFERENCES `AccountTransaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
