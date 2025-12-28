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
    name: Events.GuildEmojiDelete,

    /**
     * @param {GuildEmoji} emoji
     * @param {ExtendedClient} client
     */
    async execute(emoji: GuildEmoji, client: ExtendedClient) {
        const guildId = emoji.guild.id;

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

        const auditLogs = await emoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiDelete,
            limit: 1
        });
        const logEntry = auditLogs.entries.first();
        const executor = logEntry?.executor;

        const message = [
            `### 🗑️ Emoji Deleted`,
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
            `### Deleted Emoji`,
            `> **Name:** \`${emoji.name}\``,
            `> **Emoji ID:** \`${emoji.id}\``,
            `> **Animated:** \`${emoji.animated ? "Yes" : "No"}\``,
            `> **Requires Colons:** \`${emoji.requiresColons ? "Yes" : "No"}\``,
            `> **Was:** <${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`,
            `> **URL:** [Click here](${emoji.url})`,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
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
            }, null, 2),
            "EmojiDelete"
        );
    }
};