/*
  Warnings:

  - You are about to drop the column `UUID` on the `XPStreaks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."XPStreaks_UUID_key";

-- AlterTable
ALTER TABLE "public"."XPStreaks" DROP COLUMN "UUID";
