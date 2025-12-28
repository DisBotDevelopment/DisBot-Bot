import {
    AuditLogEvent,
    ChannelType,
    Events,
    GuildChannel,
    Message,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

function getChannelTypeName(type: ChannelType): string {
    const types: Record<ChannelType, string> = {
        [ChannelType.GuildText]: "Text Channel",
        [ChannelType.GuildVoice]: "Voice Channel",
        [ChannelType.GuildCategory]: "Category",
        [ChannelType.GuildAnnouncement]: "Announcement Channel",
        [ChannelType.AnnouncementThread]: "Announcement Thread",
        [ChannelType.PublicThread]: "Public Thread",
        [ChannelType.PrivateThread]: "Private Thread",
        [ChannelType.GuildStageVoice]: "Stage Channel",
        [ChannelType.GuildDirectory]: "Directory",
        [ChannelType.GuildForum]: "Forum Channel",
        [ChannelType.GuildMedia]: "Media Channel",
        [ChannelType.DM]: "DM",
        [ChannelType.GroupDM]: "Group DM"
    };
    return types[type] || `Unknown (${type})`;
}

export default {
    name: Events.MessageDelete,

    async execute(message: Message, client: ExtendedClient) {
        try {
            if (!message.guild || message.author?.bot) return;

            const enabled = await database.guildFeatureToggles.findFirst({
                where: {
                    GuildId: message.guild.id,
                    LoggingEnabled: true
                }
            });

            if (!enabled?.LoggingEnabled) return;

            const loggingData = await database.guildLogging.findFirst({
                where: {
                    GuildId: message.guild.id
                }
            });

            if (!loggingData?.Message) return;

            const webhook = new WebhookClient({url: loggingData.Message});

            let deleter = null;
            try {
                const auditLogs = await message.guild.fetchAuditLogs({
                    type: AuditLogEvent.MessageDelete,
                    limit: 5
                });

                deleter = auditLogs.entries.find(entry =>
                    entry.target?.id === message.author.id &&
                    entry.createdTimestamp > Date.now() - 5000
                )?.executor;
            } catch (error) {
                console.error("Failed to fetch audit logs:", error);
            }

            const truncatedContent = message.content?.length > 1500
                ? `${message.content.substring(0, 1500)}...`
                : message.content || "*No text content*";

            const createdTimestamp = Math.floor(message.createdAt.getTime() / 1000);

            const messageLog = [
                `### 🗑️ Message Deleted`,
                ``,
                ...(deleter ? [
                    `### Deleted By`,
                    `> <@${deleter.id}>`,
                    `> **User ID:** \`${deleter.id}\``,
                    `> **Username:** \`${deleter.tag}\``,
                    ``
                ] : []),
                `### Message Author`,
                `> <@${message.author.id}>`,
                `> **User ID:** \`${message.author.id}\``,
                `> **Username:** \`${message.author.tag}\``,
                ``,
                `### Message Details`,
                `> **Channel:** <#${message.channel.id}>`,
                `> **Message ID:** \`${message.id}\``,
                `> **Created:** <t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)`,
                `> **Has Attachments:** \`${message.attachments.size > 0 ? "Yes" : "No"}\``,
                ...(message.attachments.size > 0 ? [
                    `> **Attachment Count:** \`${message.attachments.size}\``
                ] : []),
                ``,
                `### Content`,
                `> ${truncatedContent}`,
                ``,
                `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
            ].join("\n");

            await loggingHelper(
                client,
                messageLog,
                webhook,
                JSON.stringify({
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
                        tag: message.author.tag
                    },
                    channel: {
                        id: message.channel.id,
                        name: message.channel.isTextBased() ? (message.channel as GuildChannel).name : "Unknown",
                        type: getChannelTypeName(message.channel.type)
                    },
                    deleter: deleter ? {
                        id: deleter.id,
                        username: deleter.username,
                        tag: deleter.tag
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
                }, null, 2),
                "MessageDelete"
            );

        } catch (error) {
            console.error("Error processing message delete event:", error);
        }
    }
};