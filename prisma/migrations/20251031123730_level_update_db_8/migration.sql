/*
  Warnings:

  - You are about to drop the column `RequiredXPForumular` on the `LevelSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."LevelSettings" DROP COLUMN "RequiredXPForumular",
ADD COLUMN     "RequiredXPFormular" TEXT;
