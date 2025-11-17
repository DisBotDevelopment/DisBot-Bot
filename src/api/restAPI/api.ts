import disbotstatsRoute from "./routes/get/disbotstats.js";
import express from "express";
import multer from "multer";
import {Logger} from "../../main/logger.js";
import {LoggingAction} from "../../enums/loggingTypes.js";
import cors from "cors";
import {versionData} from "../../main/version.js";
import {Config} from "../../main/config.js";
import {discoveryApi} from "./routes/get/discovery.js";
import {banList} from "./routes/get/banlist.js";
import {ExtendedClient} from "../../types/ExtendedClient.js";

export const APIServer = express();

export async function api(client: ExtendedClient) {
    // Default Values
    APIServer.set("client", client);
    APIServer.use(cors());


    // Open Stats Route
    APIServer.get("/v2/bot/stats", disbotstatsRoute);
    APIServer.get("/v2/banList", banList);
    APIServer.get("/v2/bot/discovery", discoveryApi);

    APIServer.get("/version", async (req, res): Promise<void> => {
        const version = (await versionData()).version
        res.status(200).json({version: version});
    });

    APIServer.get("/", async (req, res): Promise<void> => {
        res.status(200).json({
            message: "API is running",
            docs: "https://docs.disbot.app/api/overview",
        });
    });

    // 404-Route: Default Route if no Route is found
    APIServer.use(function (req, res) {
        res.status(404).json({
            error: "Your Route was not found!",
        });
    });

    // Run API Server
    let apiPort;
    if (Number(Config.Other.API.ApiPort) == 0 || Config.Other.API.ApiPort == undefined) {
        apiPort = Number(process.env.SERVER_PORT);
    } else {
        apiPort = Number(Config.Other.API.ApiPort);
    }

    APIServer.listen(Number(apiPort), () => {
        Logger.info(
            {
                timestamp: new Date().toISOString(),
                level: "info",
                label: "API",
                message: `API is running on port ${apiPort}`,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Other,
            }
        );
    });
}
