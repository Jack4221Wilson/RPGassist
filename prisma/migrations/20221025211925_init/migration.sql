-- CreateTable
CREATE TABLE `characters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `class` JSON NULL,
    `background` VARCHAR(20) NULL,
    `race` VARCHAR(20) NULL,
    `alignment` VARCHAR(255) NULL,
    `experience` INTEGER NULL,
    `strength` INTEGER NULL,
    `dexterity` INTEGER NULL,
    `constitution` INTEGER NULL,
    `intelligence` INTEGER NULL,
    `wisdom` INTEGER NULL,
    `charisma` INTEGER NULL,
    `saving_throws` JSON NULL,
    `speed` INTEGER NULL,
    `max_hp` INTEGER NULL,
    `hp` INTEGER NULL,
    `hit_dice` VARCHAR(191) NULL,
    `death_saves` JSON NULL,
    `skills` JSON NULL,
    `equipment` JSON NULL,
    `spells` JSON NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_key` VARCHAR(255) NOT NULL,
    `pass_word` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `user_key`(`user_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
