import {Request, Response} from "express";
import {database} from "../../../../main/database.js";

export const ticketbuttonsRoute = async (
    req: Request,
    res: Response
): Promise<void> => {
    const guildID = req.app.get("GuidlId");

    if (!guildID) {
        const ticketbuttons = await database.ticketSetups.findMany();
        const ticketbuttonsList = ticketbuttons.map((autorole: any) =>
            autorole.toObject()
        );
        res.status(200).json({ticketbuttons: ticketbuttonsList});
    }

    if (guildID) {
        const ticketbuttons = await database
            .ticketSetups.findMany({
                where: {
                    GuildId: guildID
                }
            })

        if (!ticketbuttons) {
            res.status(404).json({error: "No Autoroles Found"});
        }

        const ticketbuttonsList = ticketbuttons.map((autorole: any) =>
            autorole.toObject()
        );
        res.status(200).json({ticketbuttons: ticketbuttonsList});
    }
    req.app.set("GuidlId", undefined);
};

export default ticketbuttonsRoute;
