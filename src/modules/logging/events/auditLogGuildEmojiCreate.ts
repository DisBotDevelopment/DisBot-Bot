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
    name: Events.GuildEmojiCreate,

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

        // Fetch audit logs to get who created the emoji
        const auditLogs = await emoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiCreate,
            limit: 1
        });
        const logEntry = auditLogs.entries.first();
        const executor = logEntry?.executor;

        await loggingHelper(client,
            [
                `### New Emoji Created`,
                ``,
                `> **Name**: \`${emoji.name}\``,
                `> **ID**: \`${emoji.id}\``,
                `> **Animated**: \`${emoji.animated ? "Yes" : "No"}\``,
                `> **Preview**: <${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`,
                ``,
                `- **Created by**: @${executor?.tag}`
            ].join("\n"),
            webhook,
            JSON.stringify({
                emoji: {
                    id: emoji.id,
                    name: emoji.name,
                    animated: emoji.animated,
                    url: emoji.url,
                    createdAt: emoji.createdAt.toISOString(),
                    identifier: emoji.identifier,
                    requiresColons: emoji.requiresColons
                },
                creator: executor ? {
                    id: executor.id,
                    username: executor.username,
                    tag: executor.tag
                } : null
            }),
            "EmojiCreate"
        );
    }
};