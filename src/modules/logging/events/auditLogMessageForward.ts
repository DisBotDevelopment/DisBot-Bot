import {
    ChannelType,
    Events,
    GuildChannel,
    Message,
    WebhookClient,
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
    name: Events.MessageCreate,

    async execute(message: Message, client: ExtendedClient): Promise<void> {
        try {
            if (!message.reference || !message.guildId || message.author.bot) return;
            if (!message.messageSnapshots || message.messageSnapshots.size === 0) return;

            const guild = client.guilds.cache.get(message.guildId);
            if (!guild) return;

            const enabled = await database.guildFeatureToggles.findFirst({
                where: {
                    GuildId: guild.id,
                    LoggingEnabled: true
                }
            });

            if (!enabled?.LoggingEnabled) return;

            const loggingData = await database.guildLogging.findFirst({
                where: {
                    GuildId: guild.id
                }
            });

            if (!loggingData?.Message) return;

            const webhook = new WebhookClient({url: loggingData.Message});
            const originalMessage = message.messageSnapshots.first();

            if (!originalMessage) return;

            const truncatedContent = originalMessage.content?.length > 1500
                ? `${originalMessage.content.substring(0, 1500)}...`
                : originalMessage.content || "*No text content*";

            const originalCreatedTimestamp = Math.floor(originalMessage.createdAt.getTime() / 1000);

            const messageLog = [
                `### ↗️ Message Forwarded`,
                ``,
                `### Forwarded By`,
                `> <@${message.author.id}>`,
                `> **User ID:** \`${message.author.id}\``,
                `> **Username:** \`${message.author.tag}\``,
                ``,
                `### Original Message`,
                `> **Author:** <@${originalMessage.author.id}> (\`${originalMessage.author.tag}\`)`,
                `> **From Channel:** <#${message.reference.channelId}>`,
                `> **From Guild:** \`${guild.name}\``,
                `> **Created:** <t:${originalCreatedTimestamp}:F> (<t:${originalCreatedTimestamp}:R>)`,
                `> **Has Attachments:** \`${originalMessage.attachments.size > 0 ? "Yes" : "No"}\``,
                ...(originalMessage.attachments.size > 0 ? [
                    `> **Attachment Count:** \`${originalMessage.attachments.size}\``
                ] : []),
                ``,
                `### Content`,
                `> ${truncatedContent}`,
                ``,
                `### Links`,
                `> **Original:** [Jump to Message](${originalMessage.url})`,
                `> **Forward:** [Jump to Message](${message.url})`,
                ``,
                `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
            ].join("\n");

            await loggingHelper(
                client,
                messageLog,
                webhook,
                JSON.stringify({
                    forwardedMessage: {
                        id: message.id,
                        createdAt: message.createdAt.toISOString(),
                        url: message.url,
                        channelId: message.channel.id,
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
                            name: message.channel.isTextBased() ? (message.channel as GuildChannel).name : "Unknown",
                            type: getChannelTypeName(message.channel.type)
                        },
                        guild: {
                            id: guild.id,
                            name: guild.name
                        }
                    },
                    attachments: originalMessage.attachments.map(a => ({
                        name: a.name,
                        url: a.url,
                        size: a.size,
                        contentType: a.contentType
                    }))
                }, null, 2),
                "MessageForward"
            );

        } catch (error) {
            console.error("Error processing message forward event:", error);
        }
    }
};