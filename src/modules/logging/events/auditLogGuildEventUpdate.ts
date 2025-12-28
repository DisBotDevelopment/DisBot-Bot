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
    name: Events.GuildScheduledEventUpdate,

    async execute(
        oldEvent: GuildScheduledEvent,
        newEvent: GuildScheduledEvent,
        client: ExtendedClient
    ) {
        const guild = newEvent.guild;
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
            type: AuditLogEvent.GuildScheduledEventUpdate,
            limit: 1
        });
        const updater = auditLogs.entries.first()?.executor;

        const changes: string[] = [];

        if (oldEvent.name !== newEvent.name) {
            changes.push(
                `> **Name**`,
                `> Before: \`${oldEvent.name}\``,
                `> After: \`${newEvent.name}\``
            );
        }

        if (oldEvent.description !== newEvent.description) {
            changes.push(
                `> **Description**`,
                `> Before: \`${oldEvent.description || "None"}\``,
                `> After: \`${newEvent.description || "None"}\``
            );
        }

        if (oldEvent.scheduledStartAt?.getTime() !== newEvent.scheduledStartAt?.getTime()) {
            const oldTimestamp = oldEvent.scheduledStartAt
                ? Math.floor(oldEvent.scheduledStartAt.getTime() / 1000)
                : null;
            const newTimestamp = newEvent.scheduledStartAt
                ? Math.floor(newEvent.scheduledStartAt.getTime() / 1000)
                : null;

            changes.push(
                `> **Start Time**`,
                `> Before: ${oldTimestamp ? `<t:${oldTimestamp}:F>` : "\`Not specified\`"}`,
                `> After: ${newTimestamp ? `<t:${newTimestamp}:F>` : "\`Not specified\`"}`
            );
        }

        if (oldEvent.scheduledEndAt?.getTime() !== newEvent.scheduledEndAt?.getTime()) {
            const oldTimestamp = oldEvent.scheduledEndAt
                ? Math.floor(oldEvent.scheduledEndAt.getTime() / 1000)
                : null;
            const newTimestamp = newEvent.scheduledEndAt
                ? Math.floor(newEvent.scheduledEndAt.getTime() / 1000)
                : null;

            changes.push(
                `> **End Time**`,
                `> Before: ${oldTimestamp ? `<t:${oldTimestamp}:F>` : "\`Not specified\`"}`,
                `> After: ${newTimestamp ? `<t:${newTimestamp}:F>` : "\`Not specified\`"}`
            );
        }

        if (oldEvent.channel?.id !== newEvent.channel?.id) {
            changes.push(
                `> **Channel**`,
                `> Before: ${oldEvent.channel ? `<#${oldEvent.channel.id}>` : "\`None\`"}`,
                `> After: ${newEvent.channel ? `<#${newEvent.channel.id}>` : "\`None\`"}`
            );
        }

        if (oldEvent.entityMetadata?.location !== newEvent.entityMetadata?.location) {
            changes.push(
                `> **Location**`,
                `> Before: \`${oldEvent.entityMetadata?.location || "None"}\``,
                `> After: \`${newEvent.entityMetadata?.location || "None"}\``
            );
        }

        if (oldEvent.privacyLevel !== newEvent.privacyLevel) {
            changes.push(
                `> **Privacy Level**`,
                `> Before: \`${getPrivacyLevelName(oldEvent.privacyLevel)}\``,
                `> After: \`${getPrivacyLevelName(newEvent.privacyLevel)}\``
            );
        }

        if (oldEvent.status !== newEvent.status) {
            changes.push(
                `> **Status**`,
                `> Before: \`${getStatusName(oldEvent.status)}\``,
                `> After: \`${getStatusName(newEvent.status)}\``
            );
        }

        if (oldEvent.entityType !== newEvent.entityType) {
            changes.push(
                `> **Event Type**`,
                `> Before: \`${getEntityTypeName(oldEvent.entityType)}\``,
                `> After: \`${getEntityTypeName(newEvent.entityType)}\``
            );
        }

        if (oldEvent.coverImageURL() !== newEvent.coverImageURL()) {
            changes.push(
                `> **Cover Image**`,
                `> Before: ${oldEvent.coverImageURL() ? `[View Image](${oldEvent.coverImageURL()})` : "\`None\`"}`,
                `> After: ${newEvent.coverImageURL() ? `[View Image](${newEvent.coverImageURL()})` : "\`None\`"}`
            );
        }

        if (changes.length === 0) return;

        const message = [
            `### 🔄 Event Updated`,
            ``,
            `### Executor`,
            ...(updater ? [
                `> <@${updater.id}>`,
                `> **User ID:** \`${updater.id}\``,
                `> **Username:** \`${updater.tag}\``
            ] : [
                `> *Unknown Executor*`
            ]),
            ``,
            `### Event Details`,
            `> **Name:** \`${newEvent.name}\``,
            `> **Event ID:** \`${newEvent.id}\``,
            `> **URL:** [View Event](${newEvent.url})`,
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
                oldEvent: {
                    id: oldEvent.id,
                    name: oldEvent.name,
                    description: oldEvent.description,
                    entityType: getEntityTypeName(oldEvent.entityType),
                    status: getStatusName(oldEvent.status),
                    privacyLevel: getPrivacyLevelName(oldEvent.privacyLevel),
                    channelId: oldEvent.channel?.id,
                    location: oldEvent.entityMetadata?.location,
                    scheduledStartAt: oldEvent.scheduledStartAt?.toISOString(),
                    scheduledEndAt: oldEvent.scheduledEndAt?.toISOString(),
                    createdAt: oldEvent.createdAt?.toISOString(),
                    creatorId: oldEvent.creatorId,
                    coverImageURL: oldEvent.coverImageURL()
                },
                newEvent: {
                    id: newEvent.id,
                    name: newEvent.name,
                    description: newEvent.description,
                    entityType: getEntityTypeName(newEvent.entityType),
                    status: getStatusName(newEvent.status),
                    privacyLevel: getPrivacyLevelName(newEvent.privacyLevel),
                    channelId: newEvent.channel?.id,
                    location: newEvent.entityMetadata?.location,
                    scheduledStartAt: newEvent.scheduledStartAt?.toISOString(),
                    scheduledEndAt: newEvent.scheduledEndAt?.toISOString(),
                    createdAt: newEvent.createdAt?.toISOString(),
                    creatorId: newEvent.creatorId,
                    coverImageURL: newEvent.coverImageURL()
                },
                updater: updater ? {
                    id: updater.id,
                    username: updater.username,
                    tag: updater.tag
                } : null,
                updateTime: new Date().toISOString()
            }, null, 2),
            "GuildScheduledEventUpdate"
        );
    }
};