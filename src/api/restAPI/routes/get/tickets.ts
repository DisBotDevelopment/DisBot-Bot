/*
import {ChannelType} from "discord.js";
import {Request, Response} from "express";

export const ticketsRoute = async (
  req: Request,
  res: Response
): Promise<void> => {
  const guildID = req.app.get("GuidlId");
  const client = req.app.get("client");

  if (!guildID) {
    const tickets = await ticketsDB.find().sort();
    const ticketsList = tickets.map((ticket: any) => ticket.toObject());
    res.status(200).json({ tickets: ticketsList });
  }

  if (guildID) {
    const tdata = await ticketsDB.find().sort();
    const tickets = tdata.filter((ticket: any) => ticket.GuildID == guildID);
    const ticketmap = tickets.map((ticket: any) => ticket.toObject());

    res.status(200).json({ tickets: ticketmap });
  }
  req.app.set("GuidlId", undefined);
};

export default ticketsRoute;
*/