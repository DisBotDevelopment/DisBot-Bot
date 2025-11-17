/*
  Warnings:

  - You are about to drop the column `ChannelId` on the `XPStreaks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."LevelSettings" ADD COLUMN     "XPStreaksChannelId" TEXT;

-- AlterTable
ALTER TABLE "public"."XPStreaks" DROP COLUMN "ChannelId";
