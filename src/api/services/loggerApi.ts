import {uuid} from "short-uuid";
import {ExtendedClient} from "../../types/client.js";
import express from "express";
import path from "path";
import {Logger} from "../../main/logger.js";
import {LoggingAction} from "../../enums/loggingTypes.js";
import {database} from "../../main/database.js";
import {Config} from "../../main/config.js";

export async function loggerApi(
    client: ExtendedClient
): Promise<void> {

    const app = express();

    app.set("view engine", "ejs");
    app.use(express.static(`${process.cwd()}/src/api/public`));
    app.use(express.json());
    app.get("/logs", async (req, res) => {

        try {
            res.render(path.join(process.cwd(), "src", "api", "public", "html", "logs.ejs"), {
                logs: [],
                password: Config.Logging.BotLoggingPassword
            });
        } catch (err) {
            res.status(500).send("Fehler beim Abrufen der Logs.");
        }
    })

    app.post("/auth", async (req, res) => {
        const {password} = req.body;
        if (password === Config.Logging.BotLoggingPassword) {

            const db = await database.disBot.findFirst({
                where: {
                    GetConf: "config"
                }
            });
            const logs = db?.Logs || [];
            const sortedLogs = logs.sort((a, b) => new Date(b.Timestamp as string).getTime() - new Date(a.Timestamp as string).getTime());

            res.status(200).json({
                success: true,
                logs: sortedLogs
            });
        } else {
            res.status(401).json({success: false, message: "Invalid password"});
        }
    });

    app.get("/log/:uuid", async (req, res) => {
        try {
            const {uuid} = req.params;
            const db = await database.disBot.findFirst({
                where: {
                    Logs: {
                        some: {
                            UUID: uuid
                        }
                    }
                }
            });
            const log = db?.Logs.find(entry => entry.UUID === uuid);

            res.render(path.join(process.cwd(), "src", "api", "public", "html", "log.ejs"), {log});
        } catch (err) {
            res.status(500).send("Fehler beim Abrufen des Logs.");
        }
    })

    app.get("/", (req, res) => {
        res.redirect("/logs");
    });


    app.listen(Config.Logging.BotLoggingApiPort, () => {
        Logger.info(
            {
                timestamp: new Date().toISOString(),
                level: "info",
                label: "LoggerAPI",
                message: `Logger API is running on port ${Config.Logging.BotLoggingApiPort}`,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Other,
            }
        );
    })
}