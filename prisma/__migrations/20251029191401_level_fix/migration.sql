/*
  Warnings:

  - You are about to drop the column `LevelUoMessageTemplateId` on the `LevelSettings` table. All the data in the column will be lost.
  - Added the required column `LevelUpMessageTemplateId` to the `LevelSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."LevelSettings" DROP COLUMN "LevelUoMessageTemplateId",
ADD COLUMN     "LevelUpMessageTemplateId" TEXT NOT NULL;
