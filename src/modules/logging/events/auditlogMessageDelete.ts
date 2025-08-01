import {
    AuditLogEvent,
    channelMention,
    EmbedBuilder,
    Events, GuildChannel,
    Message, userMention,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.MessageDelete,

    async execute(message: Message, client: ExtendedClient) {
        try {
            // Basic validations
            if (!message.guild || message.author?.bot) return;

            // Check if logging is enabled
            const enabled = await database.guildFeatureToggles.findFirst({
                where: {
                    GuildId: message.guild.id,
                    LoggingEnabled: true
                }
            });

            if (!enabled?.LoggingEnabled) return;

            const loggingData = await database.guildLoggings.findFirst({
                where: {
                    GuildId: message.guild.id
                }
            });

            if (!loggingData?.Integration) return;

            const webhook = new WebhookClient({url: loggingData.Integration});

            // Get deletion details from audit logs
            let deleter = null;
            try {
                const auditLogs = await message.guild.fetchAuditLogs({
                    type: AuditLogEvent.MessageDelete,
                    limit: 5
                });

                // Find the most recent relevant deletion
                deleter = auditLogs.entries.find(entry =>
                    entry.target?.id === message.author.id &&
                    entry.createdTimestamp > Date.now() - 5000
                )?.executor;
            } catch (error) {
                console.error("Failed to fetch audit logs:", error);
            }

            // Prepare message content with proper truncation
            const truncatedContent = message.content?.length > 1500
                ? `${message.content.substring(0, 1500)}...`
                : message.content || "No text content";

            // Prepare the log message
            const messageContent = [
                `### Message Deleted`,
                ``,
                `> **Author**: ${userMention(message.author.id)} (\`${message.author.tag}\`)`,
                `> **Channel**: ${channelMention(message.channel.id)}`,
                `> **Message ID**: \`${message.id}\``,
                ``,
                `**Content**:`,
                `\`\`\`${truncatedContent}\`\`\``,
                ``,
                deleter ? `> **Deleted by**: ${userMention(deleter.id)}` : '',
                `- **Created at**: \`${message.createdAt.toLocaleString()}\``,
                `- **Deleted at**: \`${new Date().toLocaleString()}\``,
                `- **Has Attachment**: \`${message.attachments.size > 0 ? "Yes" : "No"}\``,
            ].filter(Boolean).join("\n");

            // Prepare the JSON data
            const jsonData = {
                message: {
                    id: message.id,
                    content: message.content,
                    cleanContent: message.cleanContent,
                    createdAt: message.createdAt.toISOString(),
                    deletedAt: new Date().toISOString(),
                    url: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`
                },
                author: {
                    id: message.author.id,
                    username: message.author.username,
                    tag: message.author.tag,
                    avatarURL: message.author.displayAvatarURL()
                },
                channel: {
                    id: message.channel.id,
                    name: message.channel.isTextBased() ? (message.channel as GuildChannel).name : "Unknown",
                    type: message.channel.type
                },
                deleter: deleter ? {
                    id: deleter.id,
                    username: deleter.username,
                    tag: deleter.tag,
                    avatarURL: deleter.displayAvatarURL()
                } : null,
                guild: {
                    id: message.guild.id,
                    name: message.guild.name
                },
                attachments: message.attachments.map(a => ({
                    name: a.name,
                    url: a.url,
                    size: a.size,
                    contentType: a.contentType
                }))
            };


            await loggingHelper(client,
                messageContent,
                webhook,
                JSON.stringify(jsonData, null, 2),
                "MessageDelete",
            );

        } catch (error) {
            console.error("Error processing message delete event:", error);
        }
    }
};