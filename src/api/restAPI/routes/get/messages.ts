// import {Request, Response} from "express";
//
// export const messagesRoute = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const guildID = req.app.get("GuidlId");
//
//   if (!guildID) {
//     const embeds = await messageDB.find().sort();
//     const embedsList = embeds.map((autorole: any) => autorole.toObject());
//     res.status(200).json({ messages: embedsList });
//   }
//
//   if (guildID) {
//     const embeds = await messageDB.find({ GuildID: guildID }).sort();
//
//     if (!embeds) {
//       res.status(404).json({ error: "No Autoreacts Found" });
//     }
//
//     const embedsList = embeds.map((autorole: any) => autorole.toObject());
//     res.status(200).json({ messages: embedsList });
//   }
//   req.app.set("GuidlId", undefined);
// };
//
// export default messagesRoute;
