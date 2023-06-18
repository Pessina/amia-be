/*
  Warnings:

  - A unique constraint covering the columns `[firebaseUserId]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firebaseUserId` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Doctor` ADD COLUMN `firebaseUserId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Doctor_firebaseUserId_key` ON `Doctor`(`firebaseUserId`);
