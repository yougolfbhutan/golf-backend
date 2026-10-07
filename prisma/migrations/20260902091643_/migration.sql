-- CreateTable
CREATE TABLE `CustomerPermission` (
    `customerId` INTEGER NOT NULL,
    `permissionId` INTEGER NOT NULL,

    PRIMARY KEY (`customerId`, `permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerPermission` ADD CONSTRAINT `CustomerPermission_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerPermission` ADD CONSTRAINT `CustomerPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
