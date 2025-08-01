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
    name: Events.GuildStickerCreate,

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

        // Get sticker creator from audit logs
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.StickerCreate,
            limit: 1
        }).catch(() => null);

        const creator = auditLogs?.entries.first()?.executor;

        // Format sticker details
        const stickerDetails = [
            `### New Sticker Created`,
            ``,
            `> **Name**: \`${sticker.name}\``,
            `> **ID**: \`${sticker.id}\``,
            `> **Description**: \`${sticker.description || "No description"}\``,
            `> **Format**: \`${sticker.format}\``,
            `> **Tags**: \`${sticker.tags || "None"}\``,
            ``,
            `[View Sticker](${sticker.url})`,
            ``,
            `- **Created by**: ${creator ? `@${creator.tag}` : "Unknown"}`,
            `- **Created at**: \`${new Date().toLocaleString()}\``
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
                creator: creator ? {
                    id: creator.id,
                    username: creator.username,
                    tag: creator.tag,
                    avatarURL: creator.displayAvatarURL()
                } : null,
                creationTime: new Date().toISOString()
            }, null, 2),
            "StickerCreate"
        );
    }
};