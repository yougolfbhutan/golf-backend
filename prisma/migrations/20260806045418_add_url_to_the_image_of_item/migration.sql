-- CreateTable
CREATE TABLE `ItemUrl` (
    `url` VARCHAR(500) NOT NULL,
    `itemId` INTEGER NOT NULL,

    INDEX `ItemUrl_itemId_idx`(`itemId`),
    PRIMARY KEY (`url`, `itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ItemUrl` ADD CONSTRAINT `ItemUrl_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
