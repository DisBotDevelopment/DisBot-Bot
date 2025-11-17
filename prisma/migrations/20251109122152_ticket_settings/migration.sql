-- AlterTable
ALTER TABLE "public"."Levels" ADD COLUMN     "ClaimedXPDrops" TEXT[],
ADD COLUMN     "CurrentStreakDay" INTEGER;

-- AlterTable
ALTER TABLE "public"."TicketSetups" ADD COLUMN     "TicketSettings" TEXT[];
