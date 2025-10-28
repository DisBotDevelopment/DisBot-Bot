/*
  Warnings:

  - You are about to drop the `GuildReactionRoles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReactionRoleButton` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReactionRoleSelectmenu` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."GuildReactionRoles" DROP CONSTRAINT "GuildReactionRoles_GuildId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReactionRoleButton" DROP CONSTRAINT "ReactionRoleButton_GuildReactionRoleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReactionRoleSelectmenu" DROP CONSTRAINT "ReactionRoleSelectmenu_GuildReactionRoleId_fkey";

-- DropTable
DROP TABLE "public"."GuildReactionRoles";

-- DropTable
DROP TABLE "public"."ReactionRoleButton";

-- DropTable
DROP TABLE "public"."ReactionRoleSelectmenu";
