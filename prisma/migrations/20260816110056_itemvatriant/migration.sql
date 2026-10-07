-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `itemurl` DROP FOREIGN KEY `ItemUrl_itemId_fkey`;

-- AlterTable: add itemVariantId (table is empty, so NOT NULL is fine)
ALTER TABLE `cartitem` ADD COLUMN `itemVariantId` INTEGER NOT NULL;

-- Item table changes
ALTER TABLE `item` DROP COLUMN `availability`,
    DROP COLUMN `price`,
    DROP COLUMN `stockQty`,
    ADD COLUMN `description` VARCHAR(1000) NULL;

-- DropTable
DROP TABLE `itemurl`;

-- CreateTable
CREATE TABLE `ItemVariant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NOT NULL,
    `sku` VARCHAR(50) NOT NULL,
    `color` VARCHAR(50) NULL,
    `size` VARCHAR(20) NULL,
    `packQuantity` INTEGER NOT NULL DEFAULT 1,
    `price` DECIMAL(10, 2) NOT NULL,
    `stockQty` INTEGER NOT NULL DEFAULT 0,
    `availability` BOOLEAN NOT NULL DEFAULT true,
    `attributes` JSON NULL,

    UNIQUE INDEX `ItemVariant_sku_key`(`sku`),
    INDEX `ItemVariant_itemId_idx`(`itemId`),
    INDEX `ItemVariant_color_idx`(`color`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemVariantUrl` (
    `url` VARCHAR(500) NOT NULL,
    `itemVariantId` INTEGER NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `ItemVariantUrl_itemVariantId_idx`(`itemVariantId`),
    PRIMARY KEY (`url`, `itemVariantId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex: new index created BEFORE the old one is dropped,
-- so `cartId` always has a supporting index for its FK
CREATE UNIQUE INDEX `CartItem_cartId_itemVariantId_key` ON `CartItem`(`cartId`, `itemVariantId`);

-- DropIndex: now safe — cartId is still backed by the index above
DROP INDEX `CartItem_cartId_itemId_key` ON `cartitem`;

-- AlterTable: now drop the old column
ALTER TABLE `cartitem` DROP COLUMN `itemId`;

-- AddForeignKey
ALTER TABLE `ItemVariant` ADD CONSTRAINT `ItemVariant_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemVariantUrl` ADD CONSTRAINT `ItemVariantUrl_itemVariantId_fkey` FOREIGN KEY (`itemVariantId`) REFERENCES `ItemVariant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_itemVariantId_fkey` FOREIGN KEY (`itemVariantId`) REFERENCES `ItemVariant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;