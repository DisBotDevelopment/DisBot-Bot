/*
  Warnings:

  - A unique constraint covering the columns `[UUID]` on the table `Levels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[UUID]` on the table `XPDrops` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[UUID]` on the table `XPStreaks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `UUID` to the `Levels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UUID` to the `XPDrops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UUID` to the `XPStreaks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."LevelRoles" ALTER COLUMN "Level" DROP NOT NULL,
ALTER COLUMN "Multiplier" DROP NOT NULL,
ALTER COLUMN "RoleId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Levels" ADD COLUMN     "UUID" TEXT NOT NULL,
ALTER COLUMN "XP" DROP NOT NULL,
ALTER COLUMN "RequiredXp" DROP NOT NULL,
ALTER COLUMN "Level" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."XPDrops" ADD COLUMN     "UUID" TEXT NOT NULL,
ALTER COLUMN "XPRange" DROP NOT NULL,
ALTER COLUMN "ClaimType" DROP NOT NULL,
ALTER COLUMN "TimeToRespawn" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."XPStreaks" ADD COLUMN     "UUID" TEXT NOT NULL,
ALTER COLUMN "Days" DROP NOT NULL,
ALTER COLUMN "Nickname" DROP NOT NULL,
ALTER COLUMN "BonusLevels" DROP NOT NULL,
ALTER COLUMN "BonusXP" DROP NOT NULL,
ALTER COLUMN "ChannelId" DROP NOT NULL,
ALTER COLUMN "MessageTemplateId" DROP NOT NULL,
ALTER COLUMN "Multiplier" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Levels_UUID_key" ON "public"."Levels"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "XPDrops_UUID_key" ON "public"."XPDrops"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "XPStreaks_UUID_key" ON "public"."XPStreaks"("UUID");
