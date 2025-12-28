import {
    AuditLogEvent,
    Events,
    GuildEmoji,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
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

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guildId,
                LoggingEnabled: true
            }
        });

        if (!enabled || !enabled.LoggingEnabled) return;

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: guildId
            }
        });

        if (!loggingData || !loggingData.Integration) return;

        const webhook = new WebhookClient({url: loggingData.Integration});

        const auditLogs = await oldEmoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiUpdate,
            limit: 1
        });
        const logEntry = auditLogs.entries.first();
        const executor = logEntry?.executor;

        const changes: string[] = [];

        if (oldEmoji.name !== newEmoji.name) {
            changes.push(
                `> **Name**`,
                `> Before: \`${oldEmoji.name}\``,
                `> After: \`${newEmoji.name}\``
            );
        }

        if (oldEmoji.animated !== newEmoji.animated) {
            changes.push(
                `> **Animated**`,
                `> Before: \`${oldEmoji.animated ? "Yes" : "No"}\``,
                `> After: \`${newEmoji.animated ? "Yes" : "No"}\``
            );
        }

        if (changes.length === 0) return;

        const message = [
            `### 🔄 Emoji Updated`,
            ``,
            `### Executor`,
            ...(executor ? [
                `> <@${executor.id}>`,
                `> **User ID:** \`${executor.id}\``,
                `> **Username:** \`${executor.tag}\``
            ] : [
                `> *Unknown Executor*`
            ]),
            ``,
            `### Emoji Details`,
            `> **Emoji ID:** \`${newEmoji.id}\``,
            `> **Current Preview:** <${newEmoji.animated ? 'a' : ''}:${newEmoji.name}:${newEmoji.id}>`,
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
            }, null, 2),
            "EmojiUpdate"
        );
    }
};