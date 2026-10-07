-- DropForeignKey
ALTER TABLE `customer` DROP FOREIGN KEY `Customer_id_fkey`;

-- AddForeignKey
ALTER TABLE `SessionsTable` ADD CONSTRAINT `SessionsTable_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
