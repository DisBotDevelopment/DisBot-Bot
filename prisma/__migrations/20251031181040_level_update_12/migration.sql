-- AlterTable
ALTER TABLE "public"."LevelSettings" ADD COLUMN     "XPDropsMessageType" TEXT,
ADD COLUMN     "XPStreaksMessageType" TEXT;

-- AlterTable
ALTER TABLE "public"."XPStreaks" ADD COLUMN     "RemoveTypes" TEXT[];
