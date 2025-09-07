import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    EmbedBuilder,
    Events,
    Guild,
    MessageFlags,
    TextDisplayBuilder
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {LoggingAction} from "../../../enums/loggingTypes.js";
import {Logger} from "../../../main/logger.js";
import {initGuildsToDatabase, initUsersToDatabase} from "../../../helper/databaseHelper.js";
import {Config} from "../../../main/config.js";
import {CommandHelper} from "../../../helper/CommandHelper.js";


export default {
    name: Events.GuildCreate,

    /**
     * @param {Guild} guild
     * @param {ExtendedClient} client
     */
    async execute(guild: Guild, client: ExtendedClient) {

        if (!client.user) throw new Error("Client is not defined");

        Logger.info({
            timestamp: new Date().toISOString(),
            level: "info",
            label: "BotJoin",
            message: `DisBot joined guild ${guild.name} (${guild.id}), requested by ${guild.ownerId}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Event,
        });
        await CommandHelper.loadCommands(client);
        await initGuildsToDatabase(client)
        guild.members.cache.forEach(async (member) => {
            await initUsersToDatabase(client, member.user)
        })
        
        
        
    }
};
