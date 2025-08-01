import eventsAPI from "../eventsAPI/post/eventsAPI.js";
import authMiddleware from "./middleware/defaultAuth.js";
import {eventAPIAuth} from "./middleware/eventAPIAuth.js";
import {customerChannel, customerChannels} from "./routes/get/customerChannels.js";
import {customerEmoji, customerEmojis} from "./routes/get/customerEmojis.js";
import {customerGuild, customerGuilds} from "./routes/get/customerGuilds.js";
import {
    customerAvatar,
    customerBanner,
    customername,
    customerProfile,
    customerStatus
} from "./routes/get/customerProfile.js";
import disbotstatsRoute from "./routes/get/disbotstats.js";
import reactionrolesRoute from "./routes/get/reactionroles.js";
import ticketbuttonsRoute from "./routes/get/ticketbuttons.js";
import ticketmenusRoute from "./routes/get/ticketmenus.js";
import {ExtendedClient} from "../../types/client.js";
import bodyParser from "body-parser";
import express from "express";
import multer from "multer";
import {Logger} from "../../main/logger.js";
import {LoggingAction} from "../../enums/loggingTypes.js";
import cors from "cors";
import {botData} from "../../main/version.js";
import {Config} from "../../main/config.js";

export const APIServer = express();

export async function api(client: ExtendedClient) {
    const upload = multer();

    // Default Values
    APIServer.set("client", client);
    APIServer.use(cors());

    // Routes
    // APIServer.get("/v2/autoroles", authMiddleware, autorolesRoute);
    // APIServer.get("/v2/autoreacts", authMiddleware, autoreactsRoute);
    // APIServer.get("/v2/autopublishs", authMiddleware, autopublishsRoute);
    APIServer.get("/v2/ticketmenus", authMiddleware, ticketmenusRoute);
    APIServer.get("/v2/ticketbuttons", authMiddleware, ticketbuttonsRoute);
    // APIServer.get("/v2/messages", authMiddleware, messagesRoute);
    // APIServer.get("/v2/permissions", authMiddleware, permissionsRoute);
    // APIServer.get("/v2/tickets", authMiddleware, ticketsRoute);
    APIServer.get("/v2/reactionroles", authMiddleware, reactionrolesRoute);

    // Events API
    APIServer.post('/events', eventAPIAuth, bodyParser.json(), eventsAPI);

    // Open Stats Route
    APIServer.get("/v2/bot/stats", disbotstatsRoute);

    // Customer Routes
    APIServer.get(
        "/v2/customer/:customer/guilds",
        authMiddleware,
        customerGuilds
    );
    APIServer.get(
        "/v2/customer/:customer/guild/:id",
        authMiddleware,
        customerGuild
    );
    APIServer.get(
        "/v2/customer/:customer/guild/:id/channels",
        authMiddleware,
        customerChannels
    );
    APIServer.get(
        "/v2/customer/:customer/guild/:id/channel/:channel",
        authMiddleware,
        customerChannel
    );
    APIServer.get(
        "/v2/customer/:customer/guild/:id/emojis",
        authMiddleware,
        customerEmojis
    );
    APIServer.get(
        "/v2/customer/:customer/guild/:id/emoji/:emoji",
        authMiddleware,
        customerEmoji
    );
    //  APIServer.get(
    //      "/v2/customer/:customer/guild/:id/roles",
    //    authMiddleware,
    //     autorolesRoute
    // );
    // APIServer.get(
    //     "/v2/customer/:customer/guild/:id/role/:role",
    //     authMiddleware,
    //     autorolesRoute
    //  );
    APIServer.get("/v2/customer/:customer", authMiddleware, customerProfile);
    APIServer.post(
        "/v2/customer/:customer/avatar",
        authMiddleware,
        bodyParser.json(),
        customerAvatar
    );
    APIServer.post(
        "/v2/customer/:customer/banner",
        authMiddleware,
        bodyParser.json(),
        customerBanner
    );
    APIServer.post(
        "/v2/customer/:customer/name",
        authMiddleware,
        bodyParser.json(),
        customername
    );
    APIServer.post(
        "/v2/customer/:customer/status",
        authMiddleware,
        bodyParser.json(),
        customerStatus
    );

    // APIServer.post(
    //     "/v2/image/upload",
    //     adminAuth,
    //     upload.single("image"),
    //     imageUpload
    // );
    // APIServer.get("/v2/image/:uuid", getImage);

    APIServer.get("/version", async (req, res): Promise<void> => {
        res.status(200).json({version: botData.version});
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

    // Server starten
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
