/*
  Warnings:

  - A unique constraint covering the columns `[RoleId]` on the table `LevelRoles` will be added. If there are existing duplicate values, this will fail.
  - Made the column `RoleId` on table `LevelRoles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."LevelRoles" ALTER COLUMN "RoleId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LevelRoles_RoleId_key" ON "public"."LevelRoles"("RoleId");
