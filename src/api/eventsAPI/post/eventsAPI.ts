import {Request, Response} from "express";
import {broadcastEvent} from "../server.js";


export const eventsAPI = async (req: Request,
    res: Response) => {
    const event = {
        type: req.body.type,
        guildId: req.body.guildId,
        data: req.body.data
    };

    broadcastEvent(event);

    res.status(200).json({
        success: true,
    });
};

export default eventsAPI;
