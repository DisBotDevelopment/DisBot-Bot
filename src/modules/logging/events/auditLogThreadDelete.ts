import {
    AuditLogEvent,
    ChannelType,
    Events,
    ThreadChannel,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

function getThreadTypeName(type: ChannelType): string {
    const types: Record<ChannelType, string> = {
        [ChannelType.PublicThread]: "Public Thread",
        [ChannelType.PrivateThread]: "Private Thread",
        [ChannelType.AnnouncementThread]: "Announcement Thread",
        [ChannelType.GuildText]: "Text Channel",
        [ChannelType.GuildVoice]: "Voice Channel",
        [ChannelType.GuildCategory]: "Category",
        [ChannelType.GuildAnnouncement]: "Announcement Channel",
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
    name: Events.ThreadDelete,

    /**
     * @param {ThreadChannel} thread
     * @param {ExtendedClient} client
     */
    async execute(thread: ThreadChannel, client: ExtendedClient) {
        if (!thread.guild) return;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: thread.guild.id,
                LoggingEnabled: true
            }
        });

        if (!enabled || !enabled.LoggingEnabled) return;

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: thread.guild.id
            }
        });

        if (!loggingData || !loggingData.Thread) return;

        const webhook = new WebhookClient({url: loggingData.Thread});
        const owner = thread.guild.members.cache.get(thread.ownerId);

        let deleter = null;
        try {
            const auditLogs = await thread.guild.fetchAuditLogs({
                type: AuditLogEvent.ThreadDelete,
                limit: 1
            });
            deleter = auditLogs.entries.first()?.executor;
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
        }

        const createdTimestamp = thread.createdAt
            ? Math.floor(thread.createdAt.getTime() / 1000)
            : null;

        const message = [
            `### 🗑️ Thread Deleted`,
            ``,
            ...(deleter ? [
                `### Deleted By`,
                `> <@${deleter.id}>`,
                `> **User ID:** \`${deleter.id}\``,
                `> **Username:** \`${deleter.tag}\``,
                ``
            ] : []),
            `### Thread Creator`,
            ...(owner ? [
                `> <@${owner.id}>`,
                `> **User ID:** \`${owner.id}\``,
                `> **Username:** \`${owner.user.tag}\``
            ] : [
                `> *Unknown Creator*`,
                `> **Owner ID:** \`${thread.ownerId}\``
            ]),
            ``,
            `### Deleted Thread`,
            `> **Name:** \`${thread.name}\``,
            `> **Thread ID:** \`${thread.id}\``,
            `> **Type:** \`${getThreadTypeName(thread.type)}\``,
            `> **Parent Channel:** <#${thread.parentId}>`,
            `> **Was Archived:** \`${thread.archived ? "Yes" : "No"}\``,
            `> **Was Locked:** \`${thread.locked ? "Yes" : "No"}\``,
            ...(thread.rateLimitPerUser ? [
                `> **Slowmode:** \`${thread.rateLimitPerUser} seconds\``
            ] : []),
            ...(createdTimestamp ? [
                `> **Created:** <t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)`
            ] : []),
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify({
                thread: {
                    id: thread.id,
                    name: thread.name,
                    type: getThreadTypeName(thread.type),
                    parentId: thread.parentId,
                    ownerId: thread.ownerId,
                    createdAt: thread.createdAt?.toISOString(),
                    archived: thread.archived,
                    locked: thread.locked,
                    rateLimitPerUser: thread.rateLimitPerUser
                },
                owner: owner ? {
                    id: owner.id,
                    username: owner.user.username,
                    tag: owner.user.tag
                } : null,
                deleter: deleter ? {
                    id: deleter.id,
                    username: deleter.username,
                    tag: deleter.tag
                } : null,
                deletedAt: new Date().toISOString()
            }, null, 2),
            "ThreadDelete"
        );
    }
};