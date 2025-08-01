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
    name: Events.GuildScheduledEventCreate,

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

        // Get event creator from audit logs
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.GuildScheduledEventCreate,
            limit: 1
        });
        const creator = auditLogs.entries.first()?.executor;

        // Format event details
        const eventDetails = [
            `### New Scheduled Event Created`,
            ``,
            `> **Name**: \`${guildScheduledEvent.name}\``,
            `> **Type**: \`${guildScheduledEvent.entityType}\``,
            `> **Start**: \`${guildScheduledEvent.scheduledStartAt?.toLocaleString() || "Not specified"}\``,
            `> **End**: \`${guildScheduledEvent.scheduledEndAt?.toLocaleString() || "Not specified"}\``,
            `> **Channel**: ${guildScheduledEvent.channel ? `<#${guildScheduledEvent.channel.id}>` : "None"}`,
            `> **Status**: \`${guildScheduledEvent.status}\``,
            `> **Privacy**: \`${guildScheduledEvent.privacyLevel}\``,
            ``,
            `**Description**:`,
            `\`\`\`${guildScheduledEvent.description || "No description provided"}\`\`\``,
            ``,
            `- **Created by**: @${creator?.tag || "Unknown"}`,
            `- **Event ID**: \`${guildScheduledEvent.id}\``
        ];

        await loggingHelper(client,
            eventDetails.join("\n"),
            webhook,
            JSON.stringify({
                event: {
                    id: guildScheduledEvent.id,
                    name: guildScheduledEvent.name,
                    description: guildScheduledEvent.description,
                    url: guildScheduledEvent.url,
                    entityType: guildScheduledEvent.entityType,
                    status: guildScheduledEvent.status,
                    privacyLevel: guildScheduledEvent.privacyLevel,
                    channelId: guildScheduledEvent.channel?.id,
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