import colors from "colors";
import {
    GatewayIntentBits,
    Partials,
} from "discord.js";
import {loadButtons} from "../handler/files/buttons.js";
import {loadCommands} from "../handler/files/commands.js";
import {loadEvents} from "../handler/files/events.js";
import {loadModals} from "../handler/files/modals.js";
import {loadSelectMenus} from "../handler/files/selectmenus.js";
import {ExtendedClient} from "../types/ExtendedClient.js";
import {Logger} from "./logger.js";
import {connectToDatabase, initDataToDatabase} from "./database.js";
import {Config, configStartup} from "./config.js";
import {errorSetupForNodeJs} from "../helper/errorHelper.js";
import {CommandHelper} from "../helper/CommandHelper.js";
import {api} from "../api/restAPI/api.js";
import {emojiCache} from "../helper/emojis.js";
import {versionData} from "./version.js";
import {vote} from "../api/services/vote.js";
import {app} from "../api/services/app.js";
import {vanityAPI} from "../api/services/vanity.js";

colors.enable();

await configStartup().then((c) => Logger.info("Loading Configuration (2/2).")
)

Logger.info("Building DisBot Extended Client.")
// @ts-ignore
// @ts-ignore
export const disbotClient = new ExtendedClient(
    {
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
            GatewayIntentBits.GuildMessagePolls
        ],
        partials: Object.keys(Partials).map(key => Partials[key]),
    })

await errorSetupForNodeJs().then(() => Logger.info("Setting Error Manager from Node.js Proccess."))

// Connect to the database (Prisma)
await connectToDatabase(disbotClient).then(() => Logger.info("Connected to Database. (POSTGRESQL)"))

await loadCommands(disbotClient).then(() => Logger.info("Loaded Configuration - Commands to the Collections"))
await loadSelectMenus(disbotClient).then(() => Logger.info("Loaded Configuration - Selectmenus to the Collections"))
await loadModals(disbotClient).then(() => Logger.info("Loaded Configuration - Modals to the Collections"))
await loadButtons(disbotClient).then(() => Logger.info("Loaded Configuration - Buttons to the Collections"))
await loadEvents(disbotClient).then(() => Logger.info("Loaded Configuration - Events to the Collections"))

await disbotClient
    .login(Config.Bot.DiscordBotToken)
    .then(async () => {
        Logger.info(`Connected to Discord as ${disbotClient.user?.tag} on ${disbotClient.guilds.cache.size}!`)
        process.setMaxListeners(Infinity);
        disbotClient.setMaxListeners(Infinity);

        // Database init (Default) 
        await initDataToDatabase(disbotClient)

        // Load Commands
        await CommandHelper.loadCommands(disbotClient);
        await CommandHelper.loadCustomAdminCommands(disbotClient);

        // API && Version 
        await api(disbotClient);
        await emojiCache(disbotClient);
        await versionData(disbotClient)

        // API Entypoint
        await vote(disbotClient);
        await app(disbotClient);
        await vanityAPI(disbotClient);

    })
    .catch((err) => {
        Logger.error(`Failed to login: ${err}`);
        process.exit(1);
    });

Logger.info("Bot Loading successfully finished!".green.bold)