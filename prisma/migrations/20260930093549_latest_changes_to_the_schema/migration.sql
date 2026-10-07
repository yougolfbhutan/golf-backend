/*
  Warnings:

  - You are about to drop the column `date` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tee_time]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookingId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tee_time` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_orderId_fkey`;

-- DropIndex
DROP INDEX `Booking_orderId_fkey` ON `booking`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `date`,
    DROP COLUMN `orderId`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `noofrounds` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `players` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `tee_time` DATETIME(3) NOT NULL,
    ADD COLUMN `totalPrice` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('pending', 'booked', 'cancelled', 'completed') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `order` ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `bookingId` INTEGER NULL,
    ADD COLUMN `purpose` ENUM('booking', 'order') NOT NULL,
    MODIFY `orderId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_tee_time_key` ON `Booking`(`tee_time`);

-- CreateIndex
CREATE UNIQUE INDEX `Payment_bookingId_key` ON `Payment`(`bookingId`);

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `accounttransactiondetails` RENAME INDEX `AccountTransactionDetails_accountTransactionId_fkey` TO `AccountTransactionDetails_accountTransactionId_idx`;

-- RenameIndex
ALTER TABLE `booking` RENAME INDEX `Booking_carrySetId_fkey` TO `Booking_carrySetId_idx`;

-- RenameIndex
ALTER TABLE `booking` RENAME INDEX `Booking_customerId_fkey` TO `Booking_customerId_idx`;

-- RenameIndex
ALTER TABLE `cart` RENAME INDEX `Cart_customerId_fkey` TO `Cart_customerId_idx`;

-- RenameIndex
ALTER TABLE `cartitem` RENAME INDEX `CartItem_itemVariantId_fkey` TO `CartItem_itemVariantId_idx`;

-- RenameIndex
ALTER TABLE `item` RENAME INDEX `Item_categoryId_fkey` TO `Item_categoryId_idx`;

-- RenameIndex
ALTER TABLE `order` RENAME INDEX `Order_customerId_fkey` TO `Order_customerId_idx`;
