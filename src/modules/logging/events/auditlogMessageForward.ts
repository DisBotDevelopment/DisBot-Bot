import {
    channelMention,
    EmbedBuilder,
    Events, GuildChannel,
    Message,
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
            if (!message.reference || !message.guildId || message.author.bot) return;
            if (!message.messageSnapshots || message.messageSnapshots.size === 0) return;

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
            const originalMessage = message.messageSnapshots.first();

            if (!originalMessage) return;

            // Prepare the log message
            const messageContent = [
                `### Message Forwarded`,
                ``,
                `> **Forwarded by**: ${userMention(message.author.id)} (\`${message.author.tag}\`)`,
                `> **Current Channel**: ${channelMention(message.channel.id)}`,
                ``,
                `**Original Message**:`,
                `> **Author**: ${userMention(originalMessage.author.id)} (\`${originalMessage.author.tag}\`)`,
                `> **From Channel**: ${channelMention(message.reference.channelId!)}`,
                `> **From Guild**: \`${guild.name}\` (\`${guild.id}\`)`,
                `> **Sent at**: \`${originalMessage.createdAt.toLocaleString()}\``,
                ``,
                `**Content**:`,
                `\`\`\`${originalMessage.content?.substring(0, 1500) || "No text content"}\`\`\``,
                ``,
                `[Jump to Original](${originalMessage.url})`,
                `[Jump to Forward](${message.url})`,
                `- Has Attachment**: \`${message.attachments.size > 0 ? "Yes" : "No"}\``,
            ].join("\n");

            // Prepare the JSON data
            const jsonData = {
                forwardedMessage: {
                    id: message.id,
                    createdAt: message.createdAt.toISOString(),
                    url: message.url,
                    forwarder: {
                        id: message.author.id,
                        username: message.author.username,
                        tag: message.author.tag
                    }
                },
                originalMessage: {
                    id: originalMessage.id,
                    content: originalMessage.content,
                    cleanContent: originalMessage.cleanContent,
                    createdAt: originalMessage.createdAt.toISOString(),
                    url: originalMessage.url,
                    author: {
                        id: originalMessage.author.id,
                        username: originalMessage.author.username,
                        tag: originalMessage.author.tag
                    },
                    channel: {
                        id: message.reference.channelId,
                        name: message.channel.isTextBased() ? (message.channel as GuildChannel).name : "Unknown"
                    },
                    guild: {
                        id: guild.id,
                        name: guild.name
                    }
                },
                attachments: originalMessage.attachments.map(a => ({
                    name: a.name,
                    url: a.url,
                    size: a.size
                }))
            };


            await loggingHelper(client,
                messageContent,
                webhook,
                JSON.stringify(jsonData, null, 2),
                "MessageForward"
            );

        } catch (error) {
            console.error("Error processing message forward event:", error);
        }
    }
};