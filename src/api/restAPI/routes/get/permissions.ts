// import {Request, Response} from "express";
//
// export const permissionsRoute = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//    const guildID = req.app.get("GuidlId");
//
//   if (!guildID) {
//     const perms = await permissionDB.find().sort();
//     const permsList = perms.map((autorole: any) => autorole.toObject());
//     res.status(200).json({ permisions: permsList });
//   }
//
//   if (guildID) {
//     const perms = await permissionDB.find({ GuildID: guildID }).sort();
//     if (!perms) {
//       res.status(404).json({ error: "No Autoreacts Found" });
//     }
//
//     const permsList = perms.map((autorole: any) => autorole.toObject());
//     res.status(200).json({ permisions: permsList });
//   }
//   req.app.set("GuidlId", undefined);
// };
//
// export default permissionsRoute;
