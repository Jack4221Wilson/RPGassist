/*
  Warnings:

  - A unique constraint covering the columns `[user_key,pass_word]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `users_user_key_pass_word_key` ON `users`(`user_key`, `pass_word`);
