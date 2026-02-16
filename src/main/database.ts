import {PrismaClient} from "../prisma/index.js";
import {LoggingAction} from "../enums/loggingTypes.js";
import {Logger} from "./logger.js";
import colors from "colors"
import {initGuildsToDatabase, migrateDataBase, setupDisBotConfig} from "../helper/databaseHelper.js";
import {Config} from "./config.js";
import * as process from "node:process";
import {ExtendedClient} from "../types/ExtendedClient.js";
import {PrismaPg} from "@prisma/adapter-pg";

colors.enable();

export let database: PrismaClient = new PrismaClient();

export async function connectToDatabase(client: ExtendedClient) {

    const adapter = new PrismaPg({connectionString: process.env.POSTGRESQL})
    const prisma = new PrismaClient({adapter})
    await prisma.$connect().then(() => {
        Logger.info(
            {
                guildId: "0",
                userId: "0",
                channelId: "0",
                messageId: "0",
                timestamp: new Date().toISOString(),
                level: "info",
                label: "Database",
                message: `Connected to the database successfully! (Prisma Client)`,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Database,
            }
        );
    })

    database = prisma;
}

export async function initDataToDatabase(client: ExtendedClient) {

    try {
        // TODO: Update database inits
        // await migrateDataBase(client)
        // await initGuildsToDatabase(client)
        await setupDisBotConfig(client)

        // Repeat Database Init
        setInterval(async () => {
            await setupDisBotConfig(client)
        }, 86400000)

        Logger.info(
            {
                guildId: "0",
                userId: "0",
                channelId: "0",
                messageId: "0",
                timestamp: new Date().toISOString(),
                level: "info",
                label: "Database",
                message: `Default database init Updated for ${client.guilds.cache.size} Guilds`.gray,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Database,
            }
        );
    } catch (e) {
        Logger.error(
            {
                guildId: "0",
                userId: "0",
                channelId: "0",
                messageId: "0",
                timestamp: new Date().toISOString(),
                level: "error",
                label: "Database",
                message: `Guild database init failed ${e}`.red,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Database,
            }
        );
    }
}


