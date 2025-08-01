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
        await initGuildsToDatabase(client)
        guild.members.cache.forEach(async (member) => {
            await initUsersToDatabase(client, member.user)
        })


        const owner = await client.users.fetch(guild.ownerId);
        try {
            return await owner.send({
                flags: MessageFlags.IsComponentsV2,
                components: [

                    new ContainerBuilder().addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent([`## ${await convertToEmojiPng("disbot", client.user.id)} Welcome to DisBot`,
                                ``,
                                ``,
                                `## Introduction`,
                                ``,
                                `DisBot is a powerful Discord bot designed to enhance your server's functionality and user experience. With a wide range of features, including moderation tools, fun commands, and utility functions, DisBot is the perfect companion for any Discord community. It is built with TypeScript and is designed to be modular, allowing for easy customization and extension.`,
                                ``,
                                `## Features`,
                                ``,
                                `- **Autopublish**: Automatically publish your messages in a channel to another channel`,
                                `- **Autoreact**: Automatically react to messages in a channel with a specific emoji`,
                                `- **AutoRole**: Automatically assign roles to new members when they join your server`,
                                `- **Tickets**: Create and manage support tickets for your server members (Advanced)`,
                                `- **Moderation**: Kick, ban, mute, and manage members in your server with ease`,
                                `- **TempVC**: Create temporary voice channels for your server members`,
                                `- **Notifications**: Send notifications about important events or updates (YouTube, Twitch, etc.)`,
                                `- **Message Templates**: Create and manage message templates for your server`,
                                `- **Tag System**: Create and manage tags (With custom Commands and Chat Commands (!tag))`,
                                `- **Information**: Get information about server members, channels, and roles`,
                                `- **Welcome**: Send welcome messages to new members`,
                                `- **Leave**: Send leave messages to members when they depart`,
                                `- **Logging**: Log important server events (joins, leaves, bans, etc.)`,
                                ``,
                                `## Placeholders`,
                                ``,
                                `Check the [Placeholders](https://docs.disbot.app/docs/placeholders) documentation to see all available placeholders. These are used to dynamically insert values like user IDs, usernames, and server names into messages.`,
                                ``,
                                `## API Reference`,
                                ``,
                                `Visit the [API Reference](https://docs.disbot.app/docs/api) for all available API methods and events. The Events API lets you listen to server events like member joins/leaves and bans.`,
                                ``,
                                `## Contact Us`,
                                ``,
                                `For support:`,
                                `- Use our contact form at https://xyzhub.link/message`,
                                `- Join our [Discord Server](https://disbot.app/discord)`].join("\n")))
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setEmoji("<:Owner:1191425492256047154>")
                                    .setURL(guild.channels.cache.get(guild.systemChannelId!)?.url || "https://dchat.link/disbot")
                                    .setLabel(guild.name)
                                    .setStyle(ButtonStyle.Link),
                                new ButtonBuilder()
                                    .setEmoji("<:Badge_Topgg:1191467866722140161>")
                                    .setURL("https://top.gg/bot/1063079377975377960")
                                    .setStyle(ButtonStyle.Link),
                                new ButtonBuilder()
                                    .setEmoji("<:discordbotlist:720681545425223680>")
                                    .setURL("https://discord.ly/disbot")
                                    .setStyle(ButtonStyle.Link),
                                new ButtonBuilder()
                                    .setEmoji("<:text:1199381324117594182>")
                                    .setURL("https://docs.disbot.app/")
                                    .setLabel("Docs")
                                    .setStyle(ButtonStyle.Link),
                            ),)]
            });
        } catch (e) {
            Logger.error({
                timestamp: new Date().toISOString(),
                level: "error",
                label: "BotJoin",
                message: `Failed to send welcome message to owner ${owner.tag} (${owner.id}) in guild ${guild.name} (${guild.id}): ${e}`,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Event,
            });
        }
    }
};
