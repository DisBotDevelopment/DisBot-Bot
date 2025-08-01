import {Request, Response} from "express";
import {database} from "../../../../main/database.js";

export const ticketmenusRoute = async (
    req: Request,
    res: Response
): Promise<void> => {
    const guildID = req.app.get("GuidlId");

    if (!guildID) {
        const ticketmenus = await database.ticketSetups.findMany();
        const ticketmenusList = ticketmenus.map((autorole: any) =>
            autorole.toObject()
        );
        res.status(200).json({ticketmenus: ticketmenusList});
    }

    if (guildID) {
        const ticketmenus = await database.ticketSetups.findMany({
            where: {
                GuildId: guildID
            }
        })
        if (!ticketmenus) {
            res.status(404).json({error: "No Autoroles Found"});
        }

        const ticketmenusList = ticketmenus.map((ticketmenu: any) =>
            ticketmenu.toObject()
        );
        res.status(200).json({ticketmenus: ticketmenusList});
    }
    req.app.set("GuidlId", undefined);
};

export default ticketmenusRoute;
