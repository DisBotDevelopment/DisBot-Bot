-- AlterTable
ALTER TABLE "public"."Tags" ADD COLUMN     "IsSlashCommand" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "SlashCommandId" TEXT,
ALTER COLUMN "IsShlashCommand" SET DEFAULT false;
