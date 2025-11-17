/*
  Warnings:

  - You are about to drop the column `MessageFormat` on the `LevelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `VoiceFormat` on the `LevelSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."LevelSettings" DROP COLUMN "MessageFormat",
DROP COLUMN "VoiceFormat",
ADD COLUMN     "RequiredXPForumular" TEXT;
