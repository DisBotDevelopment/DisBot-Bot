import {
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
    name: Events.GuildScheduledEventUserAdd,

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

        const startTimestamp = guildScheduledEvent.scheduledStartAt
            ? Math.floor(guildScheduledEvent.scheduledStartAt.getTime() / 1000)
            : null;

        const message = [
            `### ➕ User Joined Event`,
            ``,
            `### User`,
            `> <@${user.id}>`,
            `> **User ID:** \`${user.id}\``,
            `> **Username:** \`${user.tag}\``,
            ``,
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
                    description: guildScheduledEvent.description,
                    entityType: getEntityTypeName(guildScheduledEvent.entityType),
                    status: getStatusName(guildScheduledEvent.status),
                    channelId: guildScheduledEvent.channel?.id,
                    location: guildScheduledEvent.entityMetadata?.location,
                    scheduledStartAt: guildScheduledEvent.scheduledStartAt?.toISOString(),
                    scheduledEndAt: guildScheduledEvent.scheduledEndAt?.toISOString(),
                    url: guildScheduledEvent.url
                },
                user: {
                    id: user.id,
                    username: user.username,
                    tag: user.tag
                },
                joinTime: new Date().toISOString()
            }, null, 2),
            "GuildScheduledEventUserAdd"
        );
    }
};