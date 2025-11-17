/*
  Warnings:

  - You are about to drop the column `XPDropsMessageChannelId` on the `LevelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `XPDropsMessageType` on the `LevelSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."LevelSettings" DROP COLUMN "XPDropsMessageChannelId",
DROP COLUMN "XPDropsMessageType",
ADD COLUMN     "XPDropsMessageTemplate" TEXT;
