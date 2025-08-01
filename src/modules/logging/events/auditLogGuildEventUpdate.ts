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
    name: Events.GuildScheduledEventUpdate,

    async execute(
        oldEvent: GuildScheduledEvent,
        newEvent: GuildScheduledEvent,
        client: ExtendedClient
    ) {
        const guild = newEvent.guild;
        if (!guild) {
            console.error("Guild not found for event:", newEvent.id);
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

        // Get event updater from audit logs
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.GuildScheduledEventUpdate,
            limit: 1
        });
        const updater = auditLogs.entries.first()?.executor;

        // Track changes between old and new event
        const changes: string[] = [];

        // Helper function to format values consistently
        const formatValue = (value: any, isChannel = false): string => {
            if (value === null || value === undefined) return "None";
            if (value instanceof Date) return value.toLocaleString();
            if (isChannel) return `<#${value.id}>`;
            if (typeof value === 'object') return JSON.stringify(value);
            return value.toString();
        };

        // Define fields to check with their display names and formatting
        const fieldsToCheck = [
            {key: "name", display: "Name"},
            {key: "description", display: "Description"},
            {key: "scheduledStartAt", display: "Start Time", isDate: true},
            {key: "scheduledEndAt", display: "End Time", isDate: true},
            {key: "channel", display: "Channel", isChannel: true},
            {key: "privacyLevel", display: "Privacy Level"},
            {key: "status", display: "Status"},
            {key: "entityType", display: "Event Type"},
            {key: "entityMetadata", display: "Location", format: (v: any) => v?.location || "None"}
        ];

        // Check each field for changes
        fieldsToCheck.forEach(({key, display, isDate, isChannel, format}) => {
            const oldValue = (oldEvent as any)[key];
            const newValue = (newEvent as any)[key];

            const formattedOld = format
                ? format(oldValue)
                : formatValue(oldValue, isChannel);
            const formattedNew = format
                ? format(newValue)
                : formatValue(newValue, isChannel);

            if (formattedOld !== formattedNew) {
                changes.push(`> **${display}**: \`${formattedOld}\` → \`${formattedNew}\``);
            }
        });

        // Prepare the main message
        const messageContent = [
            `### Scheduled Event Updated`,
            ``,
            `> **Event**: \`${newEvent.name}\` (\`${newEvent.id}\`)`,
            `> **URL**: [View Event](${newEvent.url})`,
            ``,
            ...(changes.length > 0 ? changes : ["> No detectable changes were found"]),
            ``,
            `- **Updated by**: @${updater?.tag || "Unknown"}`,
            `- **Updated at**: \`${new Date().toLocaleString()}\``
        ].join("\n");

        // Prepare the JSON data
        const jsonData = {
            oldEvent: {
                id: oldEvent.id,
                name: oldEvent.name,
                description: oldEvent.description,
                entityType: oldEvent.entityType,
                status: oldEvent.status,
                privacyLevel: oldEvent.privacyLevel,
                channelId: oldEvent.channel?.id,
                scheduledStartAt: oldEvent.scheduledStartAt?.toISOString(),
                scheduledEndAt: oldEvent.scheduledEndAt?.toISOString(),
                createdAt: oldEvent.createdAt?.toISOString(),
                creatorId: oldEvent.creatorId,
                coverImageURL: oldEvent.coverImageURL(),
                entityMetadata: oldEvent.entityMetadata
            },
            newEvent: {
                id: newEvent.id,
                name: newEvent.name,
                description: newEvent.description,
                entityType: newEvent.entityType,
                status: newEvent.status,
                privacyLevel: newEvent.privacyLevel,
                channelId: newEvent.channel?.id,
                scheduledStartAt: newEvent.scheduledStartAt?.toISOString(),
                scheduledEndAt: newEvent.scheduledEndAt?.toISOString(),
                createdAt: newEvent.createdAt?.toISOString(),
                creatorId: newEvent.creatorId,
                coverImageURL: newEvent.coverImageURL(),
                entityMetadata: newEvent.entityMetadata
            },
            updater: updater ? {
                id: updater.id,
                username: updater.username,
                tag: updater.tag,
                avatarURL: updater.displayAvatarURL()
            } : null,
            updateTime: new Date().toISOString()
        };

        // Send the log
        await loggingHelper(client,
            messageContent,
            webhook,
            JSON.stringify(jsonData, null, 2),
            "GuildScheduledEventUpdate"
        );
    }
};