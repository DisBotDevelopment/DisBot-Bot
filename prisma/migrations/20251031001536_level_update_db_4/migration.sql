/*
  Warnings:

  - You are about to drop the column `Format` on the `LevelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `XPPerMessage` on the `LevelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `XPPerMinInVoice` on the `LevelSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."LevelSettings" DROP COLUMN "Format",
DROP COLUMN "XPPerMessage",
DROP COLUMN "XPPerMinInVoice",
ADD COLUMN     "MessageFormat" TEXT,
ADD COLUMN     "VoiceFormat" TEXT;
