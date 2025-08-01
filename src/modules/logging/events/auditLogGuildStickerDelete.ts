import {
    AuditLogEvent,
    Events,
    Sticker,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildStickerDelete,

    async execute(sticker: Sticker, client: ExtendedClient) {
        const guild = sticker.guild;
        if (!guild) {
            console.error("Guild not found for sticker:", sticker.id);
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

        // Get sticker deleter from audit logs
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.StickerDelete,
            limit: 1
        }).catch(() => null);

        const deleter = auditLogs?.entries.first()?.executor;

        // Format sticker details
        const stickerDetails = [
            `### Sticker Deleted`,
            ``,
            `> **Name**: \`${sticker.name}\``,
            `> **ID**: \`${sticker.id}\``,
            `> **Description**: \`${sticker.description || "No description"}\``,
            `> **Format**: \`${sticker.format}\``,
            `> **Tags**: \`${sticker.tags || "None"}\``,
            ``,
            `[View Sticker](${sticker.url})`,
            ``,
            `- **Deleted by**: ${deleter ? `@${deleter.tag}` : "Unknown"}`,
            `- **Deleted at**: \`${new Date().toLocaleString()}\``,
            `- **Created at**: \`${new Date(sticker.createdTimestamp).toLocaleString()}\``
        ];

        await loggingHelper(client,
            stickerDetails.join("\n"),
            webhook,
            JSON.stringify({
                sticker: {
                    id: sticker.id,
                    name: sticker.name,
                    description: sticker.description,
                    format: sticker.format,
                    tags: sticker.tags,
                    url: sticker.url,
                    createdAt: new Date(sticker.createdTimestamp).toISOString(),
                    available: sticker.available,
                    guildId: sticker.guildId
                },
                deleter: deleter ? {
                    id: deleter.id,
                    username: deleter.username,
                    tag: deleter.tag,
                    avatarURL: deleter.displayAvatarURL()
                } : null,
                deletionTime: new Date().toISOString(),
                existedFor: Date.now() - sticker.createdTimestamp
            }, null, 2),
            "StickerDelete"
        );
    }
};