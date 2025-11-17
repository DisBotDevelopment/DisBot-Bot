/*
  Warnings:

  - You are about to drop the column `Type` on the `LevelRoles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."LevelRoles" DROP COLUMN "Type",
ADD COLUMN     "Types" TEXT[];

-- AlterTable
ALTER TABLE "public"."LevelSettings" ADD COLUMN     "IsLevelModuleEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "VoiceXPType" TEXT,
ALTER COLUMN "LevelUpChannelId" DROP NOT NULL,
ALTER COLUMN "LeaderboardMessageTemplateId" DROP NOT NULL,
ALTER COLUMN "LeaderboardDisplayAmount" DROP NOT NULL,
ALTER COLUMN "RequiredXPForFirstLevel" DROP NOT NULL,
ALTER COLUMN "Format" DROP NOT NULL,
ALTER COLUMN "MessageXP" DROP NOT NULL,
ALTER COLUMN "MessageXPRange" DROP NOT NULL,
ALTER COLUMN "MesssageXPCooldown" DROP NOT NULL,
ALTER COLUMN "MessageXPType" DROP NOT NULL,
ALTER COLUMN "VoiceXP" DROP NOT NULL,
ALTER COLUMN "VoiceXPRange" DROP NOT NULL,
ALTER COLUMN "VoiceXPCooldown" DROP NOT NULL,
ALTER COLUMN "LevelUpMessageTemplateId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."XPDrops" ADD COLUMN     "ClaimAmount" INTEGER,
ADD COLUMN     "ExpireTime" INTEGER;
