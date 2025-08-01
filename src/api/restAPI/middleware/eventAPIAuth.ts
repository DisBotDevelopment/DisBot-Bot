import {Request, Response} from "express";
import {Config} from "../../../main/config.js";

export const eventAPIAuth = async (req: Request, res: Response, next: any) => {
    const authToken = req.headers["authorization"];
    const apiKey = Config.Other.EventsApi.ApiKey;
    if (!apiKey) {
        res.status(500).json({error: "API key is not defined"});
        return;
    }

    if (authToken == apiKey) {
        next();
    } else {
        res.status(401).json({error: "Invalid Auth Token"});
    }
};
