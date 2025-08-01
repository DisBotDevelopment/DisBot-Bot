import * as Sentry from "@sentry/node";
import colors from "colors";
import {
    ActivityType,
    Client,
    Collection,
    GatewayIntentBits,
    Guild,
    Partials,
    PresenceStatusData,
    PresenceUpdateStatus
} from "discord.js";
import {connect} from "mongoose";
import {loadEventsAPI} from "../api/eventsAPI/EventsAPI.js";
import {loadButtons} from "../handler/files/buttons.js";
import {loadCommands} from "../handler/files/commands.js";
import {loadEvents} from "../handler/files/events.js";
import {loadModals} from "../handler/files/modals.js";
import {loadSelectMenus} from "../handler/files/selectmenus.js";
import {ExtendedClient} from "../types/client.js";
import {Logger} from "./logger.js";
import {LoggingAction} from "../enums/loggingTypes.js";
import {connectToDatabase, initDataToDatabase} from "./database.js";
import {botData} from "./version.js";
import {CommandHelper} from "../helper/CommandHelper.js";
import {clientReady} from "../helper/readyHelper.js";
import {Config, configStartup} from "./config.js";

colors.enable();

await configStartup();

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.GuildModeration,
    ],
    partials: [
        Partials.User,
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
    ],
}) as ExtendedClient;

(client as ExtendedClient).commands = new Collection();
(client as ExtendedClient).subCommands = new Collection();
(client as ExtendedClient).subCommandGroups = new Collection();
(client as ExtendedClient).guildCommands = new Collection();
(client as ExtendedClient).guildSubCommands = new Collection();
(client as ExtendedClient).buttons = new Collection();
(client as ExtendedClient).selectmenus = new Collection();
(client as ExtendedClient).modals = new Collection();
(client as ExtendedClient).events = new Collection();
(client as ExtendedClient).cooldowns = new Collection();
(client as ExtendedClient).cache = new Collection();
(client as ExtendedClient).inviteTracker = {
    invitesCache: new Collection(),
    vanityInvitesCache: new Collection(),
    invitesCacheUpdates: new Collection()
}

// Unhandled Rejection Event
process.on("unhandledRejection", async (reason, promise) => {
    Logger.error({
        timestamp: new Date().toISOString(),
        level: "error",
        label: "UnhandledRejection",
        message: `Unhandled Rejection at: ${promise}, reason: ${reason instanceof Error ? reason.message : String(reason)}`,
        botType: Config.BotType.toString() || "Unknown",
        action: LoggingAction.Other,
    });
    Sentry.captureException(reason);
});

// Uncaught Exception Event
process.on("uncaughtException", async (err) => {
    Logger.error({
        timestamp: new Date().toISOString(),
        level: "error",
        label: "UncaughtException",
        message: `Uncaught Exception: \n${err instanceof Error ? err.message : String(err)}`,
        botType: Config.BotType.toString() || "Unknown",
        action: LoggingAction.Other,
    });
    Sentry.captureException(err);
});

// AggregateError Handling
process.on("uncaughtException", (error) => {
    Logger.error({
        timestamp: new Date().toISOString(),
        level: "error",
        label: "AggregateError",
        message: `AggregateError: \n${error.message}`,
        botType: Config.BotType.toString() || "Unknown",
        action: LoggingAction.Other,
    });
    Sentry.captureException(error);
});

// Uncaught Exception Monitor Event
process.on("uncaughtExceptionMonitor", async (err, origin) => {
    Logger.error({
        timestamp: new Date().toISOString(),
        level: "error",
        label: "UncaughtExceptionMonitor",
        message: `Uncaught Exception Monitor: \n${err instanceof Error ? err.message : String(err)}\nOrigin: ${origin}`,
        botType: Config.BotType.toString() || "Unknown",
        action: LoggingAction.Other,
    });

    Sentry.captureException(err);
});

// Connect to the database (Prisma)
await connectToDatabase(client);

async function initializeClient() {
    await loadCommands(client);
    await loadSelectMenus(client);
    await loadModals(client);
    await loadButtons(client);
    await loadEvents(client);

    await CommandHelper.loadCommands(client);
    await CommandHelper.guildLoadCommands(client);

    await loadEventsAPI(client);
}

initializeClient()
    .then(() => {
        Logger.info({
            timestamp: new Date().toISOString(),
            level: "info",
            label: "Initialization",
            message: "Client initialized successfully!",
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Other,
        });
    })
    .catch((error) => {
        Logger.error({
            timestamp: new Date().toISOString(),
            level: "error",
            label: "Initialization",
            message: `Client initialization failed: ${error}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Other,
        });
        Sentry.captureException(error);
    });

client
    .login(Config.Bot.DiscordBotToken)
    .then(async () => {
        Logger.info({
            timestamp: new Date().toISOString(),
            level: "info",
            label: "Login",
            message: `Logged in as ${client.user?.tag} (${client.user?.id})`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Other,
        });
        client.once("ready", async () => {
            clientReady(client);
            await initDataToDatabase(client)
        });

        process.setMaxListeners(0);
        client.setMaxListeners(0);
        if (process.env.SENTRY_DSN) {
            Sentry.init({
                dsn: process.env.SENTRY_DSN,
                tracesSampleRate: 1.0,
                environment: process.env.NODE_ENV || "development",
                release: botData.version,
            });
        }
    })
    .catch((err) => {
        Logger.error({
            timestamp: new Date().toISOString(),
            level: "error",
            label: "Login",
            message: `Failed to login: ${err instanceof Error ? err.message : String(err)}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Other,
        });
        Sentry.captureException(err);
        process.exit(1);
    });
