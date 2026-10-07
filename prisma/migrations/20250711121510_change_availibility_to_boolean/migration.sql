-- AlterTable
ALTER TABLE `customer` MODIFY `password` CHAR(60) NULL,
    MODIFY `phone_number` VARCHAR(50) NULL,
    MODIFY `salt` VARCHAR(191) NULL;
