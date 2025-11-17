/*
  Warnings:

  - You are about to drop the column `MesssageXPCooldown` on the `LevelSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."LevelSettings" DROP COLUMN "MesssageXPCooldown",
ADD COLUMN     "MessageXPCooldown" TEXT;
