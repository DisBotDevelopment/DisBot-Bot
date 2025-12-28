import {
    AuditLogEvent,
    Events,
    GuildScheduledEvent,
    GuildScheduledEventEntityType,
    GuildScheduledEventPrivacyLevel,
    GuildScheduledEventStatus,
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

function getPrivacyLevelName(level: GuildScheduledEventPrivacyLevel): string {
    const levels: Record<GuildScheduledEventPrivacyLevel, string> = {
        [GuildScheduledEventPrivacyLevel.GuildOnly]: "Guild Only"
    };
    return levels[level] || `Unknown (${level})`;
}

export default {
    name: Events.GuildScheduledEventCreate,

    async execute(
        guildScheduledEvent: GuildScheduledEvent,
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
            type: AuditLogEvent.GuildScheduledEventCreate,
            limit: 1
        });
        const creator = auditLogs.entries.first()?.executor;

        const startTimestamp = guildScheduledEvent.scheduledStartAt
            ? Math.floor(guildScheduledEvent.scheduledStartAt.getTime() / 1000)
            : null;
        const endTimestamp = guildScheduledEvent.scheduledEndAt
            ? Math.floor(guildScheduledEvent.scheduledEndAt.getTime() / 1000)
            : null;

        const message = [
            `### 📅 Event Created`,
            ``,
            `### Executor`,
            ...(creator ? [
                `> <@${creator.id}>`,
                `> **User ID:** \`${creator.id}\``,
                `> **Username:** \`${creator.tag}\``
            ] : [
                `> *Unknown Executor*`
            ]),
            ``,
            `### Event Details`,
            `> **Name:** \`${guildScheduledEvent.name}\``,
            `> **Event ID:** \`${guildScheduledEvent.id}\``,
            `> **Type:** \`${getEntityTypeName(guildScheduledEvent.entityType)}\``,
            `> **Status:** \`${getStatusName(guildScheduledEvent.status)}\``,
            `> **Privacy:** \`${getPrivacyLevelName(guildScheduledEvent.privacyLevel)}\``,
            ...(guildScheduledEvent.channel ? [
                `> **Channel:** <#${guildScheduledEvent.channel.id}>`
            ] : []),
            ...(guildScheduledEvent.entityMetadata?.location ? [
                `> **Location:** \`${guildScheduledEvent.entityMetadata.location}\``
            ] : []),
            ``,
            `### Schedule`,
            ...(startTimestamp ? [
                `> **Start:** <t:${startTimestamp}:F> (<t:${startTimestamp}:R>)`
            ] : [
                `> **Start:** \`Not specified\``
            ]),
            ...(endTimestamp ? [
                `> **End:** <t:${endTimestamp}:F> (<t:${endTimestamp}:R>)`
            ] : [
                `> **End:** \`Not specified\``
            ]),
            ``,
            ...(guildScheduledEvent.description ? [
                `### Description`,
                `> ${guildScheduledEvent.description}`,
                ``
            ] : []),
            ...(guildScheduledEvent.coverImageURL() ? [
                `### Cover Image`,
                `> [View Cover Image](${guildScheduledEvent.coverImageURL()})`,
                ``
            ] : []),
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
                    description: guildScheduledEvent.description,
                    url: guildScheduledEvent.url,
                    entityType: getEntityTypeName(guildScheduledEvent.entityType),
                    status: getStatusName(guildScheduledEvent.status),
                    privacyLevel: getPrivacyLevelName(guildScheduledEvent.privacyLevel),
                    channelId: guildScheduledEvent.channel?.id,
                    location: guildScheduledEvent.entityMetadata?.location,
                    scheduledStartAt: guildScheduledEvent.scheduledStartAt?.toISOString(),
                    scheduledEndAt: guildScheduledEvent.scheduledEndAt?.toISOString(),
                    createdAt: guildScheduledEvent.createdAt?.toISOString(),
                    creatorId: guildScheduledEvent.creatorId,
                    coverImageURL: guildScheduledEvent.coverImageURL()
                },
                creator: creator ? {
                    id: creator.id,
                    username: creator.username,
                    tag: creator.tag
                } : null
            }, null, 2),
            "GuildScheduledEventCreate"
        );
    }
};