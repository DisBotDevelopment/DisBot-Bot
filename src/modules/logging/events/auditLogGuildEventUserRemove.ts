import {
    AuditLogEvent,
    Events,
    GuildScheduledEvent,
    User,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildScheduledEventUserRemove,

    async execute(
        guildScheduledEvent: GuildScheduledEvent,
        user: User,
        client: ExtendedClient
    ) {
        const guild = guildScheduledEvent.guild;
        if (!guild) {
            console.error("Guild not found for event:", guildScheduledEvent.id);
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

        // Get audit logs to determine if removal was manual
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.GuildScheduledEventDelete,
            limit: 1
        }).catch(() => null);

        const remover = auditLogs?.entries.first()?.executor;
        const wasManual = remover && remover.id !== user.id;

        // Format event details
        const eventDetails = [
            `### User Left Scheduled Event`,
            ``,
            `> **Event**: \`${guildScheduledEvent.name}\` (\`${guildScheduledEvent.id}\`)`,
            `> **User**: ${user} (\`${user.id}\`)`,
            wasManual ? `> **Removed by**: ${remover} (\`${remover.id}\`)` : '',
            `> **Start Time**: \`${guildScheduledEvent.scheduledStartAt?.toLocaleString() || "Not specified"}\``,
            `> **Location**: ${guildScheduledEvent.channel ? `<#${guildScheduledEvent.channel.id}>` : "None"}`,
            `> **Event Status**: \`${guildScheduledEvent.status}\``,
            ``,
            `- **Left at**: \`${new Date().toLocaleString()}\``
        ].filter(Boolean).join("\n");

        await loggingHelper(client,
            eventDetails,
            webhook,
            JSON.stringify({
                event: {
                    id: guildScheduledEvent.id,
                    name: guildScheduledEvent.name,
                    channelId: guildScheduledEvent.channel?.id,
                    scheduledStartAt: guildScheduledEvent.scheduledStartAt?.toISOString(),
                    status: guildScheduledEvent.status,
                    url: guildScheduledEvent.url
                },
                user: {
                    id: user.id,
                    username: user.username,
                    tag: user.tag,
                    avatarURL: user.displayAvatarURL()
                },
                remover: wasManual ? {
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