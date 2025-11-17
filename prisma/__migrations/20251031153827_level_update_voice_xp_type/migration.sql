/*
  Warnings:

  - The `VoiceXPType` column on the `LevelSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."LevelSettings" DROP COLUMN "VoiceXPType",
ADD COLUMN     "VoiceXPType" TEXT[];
