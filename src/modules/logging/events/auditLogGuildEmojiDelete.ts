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
    name: Events.GuildEmojiDelete,

    /**
     * @param {GuildEmoji} emoji
     * @param {ExtendedClient} client
     */
    async execute(emoji: GuildEmoji, client: ExtendedClient) {
        const guildId = emoji.guild.id;

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

        // Fetch audit logs to get who deleted the emoji
        const auditLogs = await emoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiDelete,
            limit: 1
        });
        const logEntry = auditLogs.entries.first();
        const executor = logEntry?.executor;

        await loggingHelper(client,
            [
                `### Emoji Deleted`,
                ``,
                `> **Name**: \`${emoji.name}\``,
                `> **ID**: \`${emoji.id}\``,
                `> **Animated**: \`${emoji.animated ? "Yes" : "No"}\``,
                `> **Was**: <${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`,
                ``,
                `- **Deleted by**: @${executor?.tag}`
            ].join("\n"),
            webhook,
            JSON.stringify({
                emoji: {
                    id: emoji.id,
                    name: emoji.name,
                    animated: emoji.animated,
                    url: emoji.url,
                    createdAt: emoji.createdAt?.toISOString(),
                    identifier: emoji.identifier,
                    requiresColons: emoji.requiresColons
                },
                deleter: executor ? {
                    id: executor.id,
                    username: executor.username,
                    tag: executor.tag
                } : null,
                deletionTime: new Date().toISOString()
            }),
            "EmojiDelete"
        );
    }
};