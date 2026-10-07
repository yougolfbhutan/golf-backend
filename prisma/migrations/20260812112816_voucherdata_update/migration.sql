/*
  Warnings:

  - You are about to drop the column `voucher` on the `accounttransaction` table. All the data in the column will be lost.
  - Added the required column `voucher_date` to the `AccountTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accounttransaction` DROP COLUMN `voucher`,
    ADD COLUMN `voucher_date` DATETIME(3) NOT NULL;
