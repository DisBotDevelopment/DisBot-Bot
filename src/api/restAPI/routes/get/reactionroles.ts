import { ChannelType } from "discord.js";
import { Request, Response } from "express";
import { database } from "../../../../main/database.js";

export const reactionrolesRoute = async (
  req: Request,
  res: Response
): Promise<void> => {
  const guildID = req.app.get("GuidlId");

  if (!guildID) {
    const reactionroles = await database.reactionRoles.findMany();
    const reactionrolesList = reactionroles.map((ticket: any) =>
      ticket.toObject()
    );
    res.status(200).json({ reactionroles: reactionrolesList });
  }

  if (guildID) {
    const reactionroles = await database.reactionRoles
      .findMany({
        where: {
          GuildId: guildID
        }
      })
    if (!reactionroles) {
      res.status(404).json({ error: "No Reactionroles Found" });
    }

    const reactionrolesList = reactionroles.map((autorole: any) =>
      autorole.toObject()
    );
    res.status(200).json({ reactionroles: reactionrolesList });
  }
  req.app.set("GuidlId", undefined);
};

export default reactionrolesRoute;
