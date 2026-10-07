/*
  Warnings:

  - A unique constraint covering the columns `[variant_key]` on the table `ItemVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `variant_key` to the `ItemVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `itemvariant` ADD COLUMN `variant_key` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ItemVariant_variant_key_key` ON `ItemVariant`(`variant_key`);
