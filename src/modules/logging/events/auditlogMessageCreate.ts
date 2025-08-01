import {
    AuditLogEvent,
    channelMention,
    EmbedBuilder,
    Events, GuildChannel,
    Message,
    PermissionFlagsBits,
    userMention,
    WebhookClient,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.MessageCreate,

    async execute(message: Message, client: ExtendedClient): Promise<void> {
        try {
            // Basic validations
            if (!message.guildId || message.author.bot) return;

            const guild = client.guilds.cache.get(message.guildId);
            if (!guild) {
                console.error(`Guild not found for message ${message.id}`);
                return;
            }

            // Check if logging is enabled
            const enabled = await database.guildFeatureToggles.findFirst({
                where: {
                    GuildId: guild.id,
                    LoggingEnabled: true
                }
            });

            if (!enabled?.LoggingEnabled) return;

            const loggingData = await database.guildLoggings.findFirst({
                where: {
                    GuildId: guild.id
                }
            });

            if (!loggingData?.Integration) return;

            const webhook = new WebhookClient({url: loggingData.Integration});

            // Prepare message content with proper truncation
            const truncatedContent = message.content.length > 1500
                ? `${message.content.substring(0, 1500)}...`
                : message.content;

            // Prepare the log message
            const messageContent = [
                `### New Message Created`,
                ``,
                `> **Author**: ${userMention(message.author.id)} (\`${message.author.tag}\`)`,
                `> **Channel**: ${channelMention(message.channel.id)}`,
                `> **Message ID**: \`${message.id}\``,
                ``,
                `**Content**:`,
                `\`\`\`${truncatedContent || "No text content"}\`\`\``,
                ``,
                `[Jump to Message](${message.url})`,
                `- **Sent at**: \`${message.createdAt.toLocaleString()}\``,
                `- **Has Message Attachment**: \`${message.attachments.size > 0 ? "Yes" : "No"}\``,
            ].join("\n");

            // Prepare the JSON data
            const jsonData = {
                message: {
                    id: message.id,
                    content: message.content,
                    cleanContent: message.cleanContent,
                    createdAt: message.createdAt.toISOString(),
                    url: message.url,
                    attachments: message.attachments.map(a => ({
                        name: a.name,
                        url: a.url,
                        size: a.size,
                        contentType: a.contentType
                    }))
                },
                author: {
                    id: message.author.id,
                    username: message.author.username,
                    tag: message.author.tag,
                    avatarURL: message.author.displayAvatarURL(),
                    bot: message.author.bot
                },
                channel: {
                    id: message.channel.id,
                    name: message.channel.isTextBased() ? (message.channel as GuildChannel).name : "Unknown",
                    type: message.channel.type
                },
                guild: {
                    id: guild.id,
                    name: guild.name
                }
            };


            await loggingHelper(client,
                messageContent,
                webhook,
                JSON.stringify(jsonData, null, 2),
                "MessageCreate"
            );

        } catch (error) {
            console.error("Error processing message create event:", error);
        }
    }
};