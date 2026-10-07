/*
  Warnings:

  - You are about to drop the `sessionstable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `sessionstable` DROP FOREIGN KEY `SessionsTable_userId_fkey`;

-- DropTable
DROP TABLE `sessionstable`;
