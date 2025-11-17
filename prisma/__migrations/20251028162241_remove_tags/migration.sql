/*
  Warnings:

  - You are about to drop the `Tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Tags" DROP CONSTRAINT "Tags_GuildId_fkey";

-- DropTable
DROP TABLE "public"."Tags";
