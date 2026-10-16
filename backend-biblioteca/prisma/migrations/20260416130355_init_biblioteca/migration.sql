-- CreateTable
CREATE TABLE `Utente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeCompleto` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `ruolo` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Utente_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Libro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titolo` VARCHAR(191) NOT NULL,
    `autore` VARCHAR(191) NOT NULL,
    `genere` VARCHAR(191) NULL,
    `descrizione` TEXT NULL,
    `copieTotali` INTEGER NOT NULL,
    `copieDisponibili` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Noleggio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utenteId` INTEGER NOT NULL,
    `libroId` INTEGER NOT NULL,
    `dataNoleggio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataScadenza` DATETIME(3) NOT NULL,
    `dataRestituzione` DATETIME(3) NULL,
    `stato` ENUM('ATTIVO', 'RESTITUITO', 'SCADUTO') NOT NULL DEFAULT 'ATTIVO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartaFedelta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utenteId` INTEGER NOT NULL,
    `puntiTotali` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CartaFedelta_utenteId_key`(`utenteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovimentoFedelta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cartaFedeltaId` INTEGER NOT NULL,
    `noleggioId` INTEGER NULL,
    `punti` INTEGER NOT NULL,
    `motivazione` VARCHAR(191) NOT NULL,
    `dataMovimento` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Noleggio` ADD CONSTRAINT `Noleggio_utenteId_fkey` FOREIGN KEY (`utenteId`) REFERENCES `Utente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Noleggio` ADD CONSTRAINT `Noleggio_libroId_fkey` FOREIGN KEY (`libroId`) REFERENCES `Libro`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartaFedelta` ADD CONSTRAINT `CartaFedelta_utenteId_fkey` FOREIGN KEY (`utenteId`) REFERENCES `Utente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimentoFedelta` ADD CONSTRAINT `MovimentoFedelta_cartaFedeltaId_fkey` FOREIGN KEY (`cartaFedeltaId`) REFERENCES `CartaFedelta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimentoFedelta` ADD CONSTRAINT `MovimentoFedelta_noleggioId_fkey` FOREIGN KEY (`noleggioId`) REFERENCES `Noleggio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
