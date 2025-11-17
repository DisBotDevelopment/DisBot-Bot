/*
  Warnings:

  - You are about to drop the column `TempVoiceId` on the `TempVoiceChannels` table. All the data in the column will be lost.
  - You are about to drop the `TempVoices` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `TempVoiceConfigId` to the `TempVoiceChannels` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."TempVoiceChannels" DROP CONSTRAINT "TempVoiceChannels_TempVoiceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TempVoices" DROP CONSTRAINT "TempVoices_GuildId_fkey";

-- AlterTable
ALTER TABLE "public"."TempVoiceChannels" DROP COLUMN "TempVoiceId",
ADD COLUMN     "TempVoiceConfigId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."TempVoices";

-- CreateTable
CREATE TABLE "public"."TempVoice" (
    "Id" SERIAL NOT NULL,
    "UserInviteMessageTemplateId" TEXT,
    "ModeratorUserIds" TEXT[],
    "TempVoiceLogChannelId" TEXT,
    "GuildId" TEXT NOT NULL,

    CONSTRAINT "TempVoice_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."TempVoiceConfig" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "CreatorChannel" TEXT,
    "ChannelCategory" TEXT,
    "ManageMessageTemplateId" TEXT,
    "IsManageEnalbed" BOOLEAN NOT NULL DEFAULT true,
    "TempVoicePresetId" TEXT NOT NULL,
    "TempVoiceId" TEXT NOT NULL,

    CONSTRAINT "TempVoiceConfig_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."TempVoicePreset" (
    "Id" SERIAL NOT NULL,
    "UUID" TEXT NOT NULL,
    "ChannelName" TEXT,
    "ChannelLimit" INTEGER,
    "ChannelRegion" TEXT,
    "ChannelBitRate" TEXT,
    "UserInviteType" TEXT DEFAULT 'ping',
    "SendLogsInTempChannel" BOOLEAN NOT NULL DEFAULT true,
    "BlacklistRoleId" TEXT,
    "ManageComponents" TEXT[],
    "OwnerAllowedDiscordPermissions" TEXT[],
    "OwnerDeniedDiscordPermissions" TEXT[],
    "TempVoiceId" TEXT NOT NULL,

    CONSTRAINT "TempVoicePreset_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."TempVoicePresetDiscordRolePermission" (
    "Id" SERIAL NOT NULL,
    "RoleId" TEXT NOT NULL,
    "AllowedDiscordPermissions" TEXT[],
    "DeniedDiscordPermissions" TEXT[],
    "TempVoicePresetId" TEXT NOT NULL,

    CONSTRAINT "TempVoicePresetDiscordRolePermission_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."TempVoiceChannelMember" (
    "Id" SERIAL NOT NULL,
    "UserId" TEXT NOT NULL,
    "ChannelId" TEXT NOT NULL,
    "Permissions" TEXT[] DEFAULT ARRAY['kick', 'name', 'limit', 'look', 'unlook']::TEXT[],

    CONSTRAINT "TempVoiceChannelMember_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempVoice_GuildId_key" ON "public"."TempVoice"("GuildId");

-- CreateIndex
CREATE UNIQUE INDEX "TempVoiceConfig_UUID_key" ON "public"."TempVoiceConfig"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "TempVoiceConfig_TempVoicePresetId_key" ON "public"."TempVoiceConfig"("TempVoicePresetId");

-- CreateIndex
CREATE UNIQUE INDEX "TempVoicePreset_UUID_key" ON "public"."TempVoicePreset"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "TempVoicePresetDiscordRolePermission_TempVoicePresetId_key" ON "public"."TempVoicePresetDiscordRolePermission"("TempVoicePresetId");

-- CreateIndex
CREATE UNIQUE INDEX "TempVoiceChannelMember_ChannelId_key" ON "public"."TempVoiceChannelMember"("ChannelId");

-- AddForeignKey
ALTER TABLE "public"."TempVoice" ADD CONSTRAINT "TempVoice_GuildId_fkey" FOREIGN KEY ("GuildId") REFERENCES "public"."Guilds"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TempVoiceConfig" ADD CONSTRAINT "TempVoiceConfig_TempVoicePresetId_fkey" FOREIGN KEY ("TempVoicePresetId") REFERENCES "public"."TempVoicePreset"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TempVoiceConfig" ADD CONSTRAINT "TempVoiceConfig_TempVoiceId_fkey" FOREIGN KEY ("TempVoiceId") REFERENCES "public"."TempVoice"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TempVoicePreset" ADD CONSTRAINT "TempVoicePreset_TempVoiceId_fkey" FOREIGN KEY ("TempVoiceId") REFERENCES "public"."TempVoice"("GuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TempVoicePresetDiscordRolePermission" ADD CONSTRAINT "TempVoicePresetDiscordRolePermission_TempVoicePresetId_fkey" FOREIGN KEY ("TempVoicePresetId") REFERENCES "public"."TempVoicePreset"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TempVoiceChannels" ADD CONSTRAINT "TempVoiceChannels_TempVoiceConfigId_fkey" FOREIGN KEY ("TempVoiceConfigId") REFERENCES "public"."TempVoiceConfig"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TempVoiceChannelMember" ADD CONSTRAINT "TempVoiceChannelMember_ChannelId_fkey" FOREIGN KEY ("ChannelId") REFERENCES "public"."TempVoiceChannels"("ChannelId") ON DELETE RESTRICT ON UPDATE CASCADE;
