import {
    AuditLogEvent,
    Client,
    Events,
    GuildScheduledEvent,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildScheduledEventDelete,

    async execute(
        guildScheduledEvent: GuildScheduledEvent,
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

        // Get event deleter from audit logs
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.GuildScheduledEventDelete,
            limit: 1
        });
        const deleter = auditLogs.entries.first()?.executor;

        // Format event details
        const eventDetails = [
            `### Scheduled Event Deleted`,
            ``,
            `> **Name**: \`${guildScheduledEvent.name}\``,
            `> **Type**: \`${guildScheduledEvent.entityType}\``,
            `> **Was scheduled for**: \`${guildScheduledEvent.scheduledStartAt?.toLocaleString() || "Not specified"}\``,
            `> **End time**: \`${guildScheduledEvent.scheduledEndAt?.toLocaleString() || "Not specified"}\``,
            `> **Location**: ${guildScheduledEvent.channel ? `<#${guildScheduledEvent.channel.id}>` : "None"}`,
            `> **Status**: \`${guildScheduledEvent.status}\``,
            ``,
            `**Description**:`,
            `\`\`\`${guildScheduledEvent.description || "No description provided"}\`\`\``,
            ``,
            `- **Deleted by**: @${deleter?.tag || "Unknown"}`,
            `- **Event ID**: \`${guildScheduledEvent.id}\``,
            `- **Deleted at**: \`${new Date().toLocaleString()}\``
        ];

        await loggingHelper(client,
            eventDetails.join("\n"),
            webhook,
            JSON.stringify({
                event: {
                    id: guildScheduledEvent.id,
                    name: guildScheduledEvent.name,
                    description: guildScheduledEvent.description,
                    entityType: guildScheduledEvent.entityType,
                    status: guildScheduledEvent.status,
                    channelId: guildScheduledEvent.channel?.id,
                    scheduledStartAt: guildScheduledEvent.scheduledStartAt?.toISOString(),
                    scheduledEndAt: guildScheduledEvent.scheduledEndAt?.toISOString(),
                    createdAt: guildScheduledEvent.createdAt?.toISOString(),
                    creatorId: guildScheduledEvent.creatorId
                },
                deleter: deleter ? {
                    id: deleter.id,
                    username: deleter.username,
                    tag: deleter.tag
                } : null,
                deletionTime: new Date().toISOString()
            }, null, 2),
            "GuildScheduledEventDelete"
        );
    }
};