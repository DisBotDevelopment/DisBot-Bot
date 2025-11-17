/*
  Warnings:

  - You are about to drop the column `MessageXP` on the `LevelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `VoiceXP` on the `LevelSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."LevelSettings" DROP COLUMN "MessageXP",
DROP COLUMN "VoiceXP",
ADD COLUMN     "IsMessageXPEnabled" BOOLEAN DEFAULT false,
ADD COLUMN     "IsVoiceXPEnabled" BOOLEAN DEFAULT false,
ADD COLUMN     "XPPerMessage" INTEGER,
ADD COLUMN     "XPPerMinInVoice" INTEGER;
