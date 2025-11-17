/*
  Warnings:

  - You are about to drop the column `ClaimType` on the `XPDrops` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."XPDrops" DROP COLUMN "ClaimType",
ADD COLUMN     "LastSpawned" TEXT;
