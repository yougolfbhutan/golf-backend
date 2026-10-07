-- AlterTable
ALTER TABLE `booking` ADD COLUMN `specialRequest` VARCHAR(255) NULL,
    MODIFY `noofrounds` INTEGER NULL DEFAULT 1;
