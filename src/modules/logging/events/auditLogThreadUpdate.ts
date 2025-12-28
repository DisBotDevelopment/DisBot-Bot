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
    name: Events.ThreadUpdate,

    /**
     * @param {ThreadChannel} oldThread
     * @param {ThreadChannel} newThread
     * @param {ExtendedClient} client
     */
    async execute(
        oldThread: ThreadChannel,
        newThread: ThreadChannel,
        client: ExtendedClient
    ) {
        if (!newThread.guild) return;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: newThread.guild.id,
                LoggingEnabled: true
            }
        });

        if (!enabled || !enabled.LoggingEnabled) return;

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: newThread.guild.id
            }
        });

        if (!loggingData || !loggingData.Thread) return;

        const webhook = new WebhookClient({url: loggingData.Thread});
        const owner = newThread.guild.members.cache.get(newThread.ownerId);

        let updater = null;
        try {
            const auditLogs = await newThread.guild.fetchAuditLogs({
                type: AuditLogEvent.ThreadUpdate,
                limit: 1
            });
            updater = auditLogs.entries.first()?.executor;
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
        }

        const changes: string[] = [];

        if (oldThread.name !== newThread.name) {
            changes.push(
                `> **Name**`,
                `> Before: \`${oldThread.name}\``,
                `> After: \`${newThread.name}\``
            );
        }

        if (oldThread.archived !== newThread.archived) {
            changes.push(
                `> **Status**`,
                `> Before: \`${oldThread.archived ? "Archived" : "Active"}\``,
                `> After: \`${newThread.archived ? "Archived" : "Active"}\``
            );
        }

        if (oldThread.locked !== newThread.locked) {
            changes.push(
                `> **Lock Status**`,
                `> Before: \`${oldThread.locked ? "Locked" : "Unlocked"}\``,
                `> After: \`${newThread.locked ? "Locked" : "Unlocked"}\``
            );
        }

        if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
            changes.push(
                `> **Slowmode**`,
                `> Before: \`${oldThread.rateLimitPerUser ? `${oldThread.rateLimitPerUser} seconds` : "Off"}\``,
                `> After: \`${newThread.rateLimitPerUser ? `${newThread.rateLimitPerUser} seconds` : "Off"}\``
            );
        }

        if (oldThread.autoArchiveDuration !== newThread.autoArchiveDuration) {
            changes.push(
                `> **Auto Archive Duration**`,
                `> Before: \`${oldThread.autoArchiveDuration ? `${oldThread.autoArchiveDuration} minutes` : "Default"}\``,
                `> After: \`${newThread.autoArchiveDuration ? `${newThread.autoArchiveDuration} minutes` : "Default"}\``
            );
        }

        if (changes.length === 0) return;

        const message = [
            `### 🔄 Thread Updated`,
            ``,
            ...(updater ? [
                `### Executor`,
                `> <@${updater.id}>`,
                `> **User ID:** \`${updater.id}\``,
                `> **Username:** \`${updater.tag}\``,
                ``
            ] : []),
            `### Thread Details`,
            `> **Thread:** <#${newThread.id}> (\`${newThread.name}\`)`,
            `> **Thread ID:** \`${newThread.id}\``,
            `> **Type:** \`${getThreadTypeName(newThread.type)}\``,
            `> **Parent Channel:** <#${newThread.parentId}>`,
            `> **Owner:** ${owner ? `<@${owner.id}>` : `\`${newThread.ownerId}\``}`,
            ``,
            `### Changes`,
            ...changes,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify({
                oldThread: {
                    name: oldThread.name,
                    type: getThreadTypeName(oldThread.type),
                    archived: oldThread.archived,
                    locked: oldThread.locked,
                    rateLimitPerUser: oldThread.rateLimitPerUser,
                    autoArchiveDuration: oldThread.autoArchiveDuration
                },
                newThread: {
                    name: newThread.name,
                    type: getThreadTypeName(newThread.type),
                    archived: newThread.archived,
                    locked: newThread.locked,
                    rateLimitPerUser: newThread.rateLimitPerUser,
                    autoArchiveDuration: newThread.autoArchiveDuration
                },
                owner: owner ? {
                    id: owner.id,
                    username: owner.user.username,
                    tag: owner.user.tag
                } : null,
                updater: updater ? {
                    id: updater.id,
                    username: updater.username,
                    tag: updater.tag
                } : null,
                updatedAt: new Date().toISOString()
            }, null, 2),
            "ThreadUpdate"
        );
    }
};