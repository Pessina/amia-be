-- DropForeignKey
ALTER TABLE `Patient` DROP FOREIGN KEY `Patient_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `Visit` DROP FOREIGN KEY `Visit_patientId_fkey`;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
