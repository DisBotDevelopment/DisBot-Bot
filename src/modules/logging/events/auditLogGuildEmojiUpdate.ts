import {
    AuditLogEvent,
    Client,
    Events,
    GuildEmoji,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildEmojiUpdate,

    async execute(
        oldEmoji: GuildEmoji,
        newEmoji: GuildEmoji,
        client: ExtendedClient
    ) {
        const guildId = oldEmoji.guild.id;

        // Check if logging is enabled
        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guildId,
                LoggingEnabled: true
            }
        });

        if (!enabled || !enabled.LoggingEnabled) return;

        const loggingData = await database.guildLoggings.findFirst({
            where: {
                GuildId: guildId
            }
        });

        if (!loggingData || !loggingData.Integration) return;

        const webhook = new WebhookClient({url: loggingData.Integration});

        // Fetch audit logs to get who updated the emoji
        const auditLogs = await oldEmoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiUpdate,
            limit: 1
        });
        const logEntry = auditLogs.entries.first();
        const executor = logEntry?.executor;

        // Track changes between old and new emoji
        const changes: string[] = [];

        if (oldEmoji.name !== newEmoji.name) {
            changes.push(
                `> **Name**: \`${oldEmoji.name}\` → \`${newEmoji.name}\``
            );
        }

        if (oldEmoji.animated !== newEmoji.animated) {
            changes.push(
                `> **Animated**: \`${oldEmoji.animated ? "Yes" : "No"}\` → \`${newEmoji.animated ? "Yes" : "No"}\``
            );
        }

        // If no changes were detected (shouldn't happen for this event)
        if (changes.length === 0) {
            changes.push("> No detectable changes were found");
        }

        await loggingHelper(client,
            [
                `### Emoji Updated`,
                ``,
                `> **ID**: \`${newEmoji.id}\``,
                `> **Preview**: <${newEmoji.animated ? 'a' : ''}:${newEmoji.name}:${newEmoji.id}>`,
                ``,
                ...changes,
                ``,
                `- **Updated by**: @${executor?.tag}`
            ].join("\n"),
            webhook,
            JSON.stringify({
                oldEmoji: {
                    id: oldEmoji.id,
                    name: oldEmoji.name,
                    animated: oldEmoji.animated,
                    url: oldEmoji.url,
                    createdAt: oldEmoji.createdAt?.toISOString(),
                    identifier: oldEmoji.identifier,
                    requiresColons: oldEmoji.requiresColons
                },
                newEmoji: {
                    id: newEmoji.id,
                    name: newEmoji.name,
                    animated: newEmoji.animated,
                    url: newEmoji.url,
                    createdAt: newEmoji.createdAt?.toISOString(),
                    identifier: newEmoji.identifier,
                    requiresColons: newEmoji.requiresColons
                },
                updater: executor ? {
                    id: executor.id,
                    username: executor.username,
                    tag: executor.tag
                } : null,
                updateTime: new Date().toISOString()
            }),
            "EmojiUpdate"
        );
    }
};