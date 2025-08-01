import {Request, Response} from "express";
import {ExtendedClient} from "../../../types/client.js";
import {Config} from "../../../main/config.js";

export const adminAuth = async (req: Request, res: Response, next: any) => {
  const client = req.app.get("client") as ExtendedClient;
  const authToken = req.headers["authorization"];

  if (!client.user) {
    res.status(401).json({ error: "Bot is not logged in" });
    return;
  }
  
  const apiKey = Config.Other.API.ApiKey;
  if (!apiKey) {
    res.status(500).json({ error: "API key is not defined" });
    return;
  }

  if (authToken == apiKey) {
    next();
  } else {
    res.status(401).json({ error: "Invalid Auth Token" });
  }
};
