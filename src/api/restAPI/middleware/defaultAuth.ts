import {Request, Response} from "express";
import {database} from "../../../main/database.js";
import {Config} from "../../../main/config.js";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: Function
): Promise<void> => {
    const guildID = req.headers["guildid"] as string;
    const authToken = req.headers["authorization"] as string;

    const data = await database.apis.findFirst({
        where: {
            Guilds: {
                has: guildID,
            },
            Key: authToken,
        },
        select: {
            Guilds: true,
            UserId: true,
        },
    });

    if (!authToken) {
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    if (!data) {
        const apiKey = Config.Other.API.ApiKey;
        if (!apiKey) {
            res.status(500).json({error: "API key is not defined"});
            return;
        }

        if (authToken == apiKey) {
            next();
            return;
        } else {
            res
                .status(401)
                .json({error: "Unauthorized, invalid API key or Auth Token"});
        }
    } else if (data && data.Guilds.includes(guildID)) {
        req.app.set("GuidlId", guildID);
        req.app.set("user", data.UserId);
        next();
    } else {
        res.status(401).json({error: "Invalid Auth Token"});
        return;
    }
};

export default authMiddleware;
