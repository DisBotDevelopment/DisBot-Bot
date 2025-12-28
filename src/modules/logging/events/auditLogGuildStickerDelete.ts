import {
    AuditLogEvent,
    Events,
    Sticker,
    StickerFormatType,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

function getStickerFormatName(format: StickerFormatType): string {
    const formats: Record<StickerFormatType, string> = {
        [StickerFormatType.PNG]: "PNG",
        [StickerFormatType.APNG]: "APNG (Animated PNG)",
        [StickerFormatType.Lottie]: "Lottie (JSON)",
        [StickerFormatType.GIF]: "GIF"
    };
    return formats[format] || `Unknown (${format})`;
}

export default {
    name: Events.GuildStickerDelete,

    async execute(sticker: Sticker, client: ExtendedClient) {
        const guild = sticker.guild;
        if (!guild) return;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guild.id,
                LoggingEnabled: true
            }
        });

        if (!enabled?.LoggingEnabled) return;

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: guild.id
            }
        });

        if (!loggingData?.Integration) return;

        const webhook = new WebhookClient({url: loggingData.Integration});

        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.StickerDelete,
            limit: 1
        }).catch(() => null);

        const deleter = auditLogs?.entries.first()?.executor;

        const createdTimestamp = Math.floor(sticker.createdTimestamp / 1000);

        const message = [
            `### 🗑️ Sticker Deleted`,
            ``,
            `### Executor`,
            ...(deleter ? [
                `> <@${deleter.id}>`,
                `> **User ID:** \`${deleter.id}\``,
                `> **Username:** \`${deleter.tag}\``
            ] : [
                `> *Unknown Executor*`
            ]),
            ``,
            `### Deleted Sticker`,
            `> **Name:** \`${sticker.name}\``,
            `> **Sticker ID:** \`${sticker.id}\``,
            `> **Description:** \`${sticker.description || "No description"}\``,
            `> **Format:** \`${getStickerFormatName(sticker.format)}\``,
            `> **Tags:** \`${sticker.tags || "None"}\``,
            `> **Was Available:** \`${sticker.available ? "Yes" : "No"}\``,
            `> **URL:** [View Sticker](${sticker.url})`,
            `> **Created:** <t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)`,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify({
                sticker: {
                    id: sticker.id,
                    name: sticker.name,
                    description: sticker.description,
                    format: getStickerFormatName(sticker.format),
                    tags: sticker.tags,
                    url: sticker.url,
                    createdAt: new Date(sticker.createdTimestamp).toISOString(),
                    available: sticker.available,
                    guildId: sticker.guildId
                },
                deleter: deleter ? {
                    id: deleter.id,
                    username: deleter.username,
                    tag: deleter.tag
                } : null,
                deletionTime: new Date().toISOString(),
                existedForMs: Date.now() - sticker.createdTimestamp
            }, null, 2),
            "StickerDelete"
        );
    }
};