-- DropForeignKey
ALTER TABLE "public"."GuildUserModeration" DROP CONSTRAINT "GuildUserModeration_LinkedCaseId_fkey";

-- AlterTable
ALTER TABLE "public"."GuildUserModeration" ALTER COLUMN "LinkedCaseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."GuildUserModeration" ADD CONSTRAINT "GuildUserModeration_LinkedCaseId_fkey" FOREIGN KEY ("LinkedCaseId") REFERENCES "public"."ModerationScoutCases"("UUID") ON DELETE SET NULL ON UPDATE CASCADE;
