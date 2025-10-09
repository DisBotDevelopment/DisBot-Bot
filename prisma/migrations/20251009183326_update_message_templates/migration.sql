-- AlterTable
ALTER TABLE "public"."MessageTemplates" ADD COLUMN     "ComponentJSON" TEXT,
ADD COLUMN     "IsComponentsV2Message" BOOLEAN NOT NULL DEFAULT false;
