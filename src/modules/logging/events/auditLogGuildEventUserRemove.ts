import {
    AuditLogEvent,
    Events,
    GuildScheduledEvent,
    GuildScheduledEventEntityType,
    GuildScheduledEventStatus,
    User,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

function getEntityTypeName(type: GuildScheduledEventEntityType): string {
    const types: Record<GuildScheduledEventEntityType, string> = {
        [GuildScheduledEventEntityType.StageInstance]: "Stage Channel",
        [GuildScheduledEventEntityType.Voice]: "Voice Channel",
        [GuildScheduledEventEntityType.External]: "External"
    };
    return types[type] || `Unknown (${type})`;
}

function getStatusName(status: GuildScheduledEventStatus): string {
    const statuses: Record<GuildScheduledEventStatus, string> = {
        [GuildScheduledEventStatus.Scheduled]: "Scheduled",
        [GuildScheduledEventStatus.Active]: "Active",
        [GuildScheduledEventStatus.Completed]: "Completed",
        [GuildScheduledEventStatus.Canceled]: "Canceled"
    };
    return statuses[status] || `Unknown (${status})`;
}

export default {
    name: Events.GuildScheduledEventUserRemove,

    async execute(
        guildScheduledEvent: GuildScheduledEvent,
        user: User,
        client: ExtendedClient
    ) {
        const guild = guildScheduledEvent.guild;
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

        if (!loggingData?.Integration) return;

        const webhook = new WebhookClient({url: loggingData.Integration});

        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.GuildScheduledEventDelete,
            limit: 1
        }).catch(() => null);

        const remover = auditLogs?.entries.first()?.executor;
        const wasManual = remover && remover.id !== user.id;

        const startTimestamp = guildScheduledEvent.scheduledStartAt
            ? Math.floor(guildScheduledEvent.scheduledStartAt.getTime() / 1000)
            : null;

        const message = [
            `### ➖ User Left Event`,
            ``,
            `### User`,
            `> <@${user.id}>`,
            `> **User ID:** \`${user.id}\``,
            `> **Username:** \`${user.tag}\``,
            ``,
            ...(wasManual && remover ? [
                `### Removed By`,
                `> <@${remover.id}>`,
                `> **User ID:** \`${remover.id}\``,
                `> **Username:** \`${remover.tag}\``,
                ``
            ] : []),
            `### Event Details`,
            `> **Name:** \`${guildScheduledEvent.name}\``,
            `> **Event ID:** \`${guildScheduledEvent.id}\``,
            `> **Type:** \`${getEntityTypeName(guildScheduledEvent.entityType)}\``,
            `> **Status:** \`${getStatusName(guildScheduledEvent.status)}\``,
            ...(guildScheduledEvent.channel ? [
                `> **Channel:** <#${guildScheduledEvent.channel.id}>`
            ] : []),
            ...(guildScheduledEvent.entityMetadata?.location ? [
                `> **Location:** \`${guildScheduledEvent.entityMetadata.location}\``
            ] : []),
            ...(startTimestamp ? [
                `> **Starts:** <t:${startTimestamp}:F> (<t:${startTimestamp}:R>)`
            ] : []),
            `> **Event URL:** [View Event](${guildScheduledEvent.url})`,
            `> **Removal Type:** \`${wasManual ? "Manually Removed" : "Self Removed"}\``,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify({
                event: {
                    id: guildScheduledEvent.id,
                    name: guildScheduledEvent.name,
                    entityType: getEntityTypeName(guildScheduledEvent.entityType),
                    status: getStatusName(guildScheduledEvent.status),
                    channelId: guildScheduledEvent.channel?.id,
                    location: guildScheduledEvent.entityMetadata?.location,
                    scheduledStartAt: guildScheduledEvent.scheduledStartAt?.toISOString(),
                    url: guildScheduledEvent.url
                },
                user: {
                    id: user.id,
                    username: user.username,
                    tag: user.tag
                },
                remover: wasManual && remover ? {
                    id: remover.id,
                    username: remover.username,
                    tag: remover.tag
                } : null,
                removalType: wasManual ? "manual" : "self",
                removalTime: new Date().toISOString()
            }, null, 2),
            "GuildScheduledEventUserRemove"
        );
    }
};