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
    name: Events.GuildStickerCreate,

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
            type: AuditLogEvent.StickerCreate,
            limit: 1
        }).catch(() => null);

        const creator = auditLogs?.entries.first()?.executor;

        const message = [
            `### 🎨 Sticker Created`,
            ``,
            `### Executor`,
            ...(creator ? [
                `> <@${creator.id}>`,
                `> **User ID:** \`${creator.id}\``,
                `> **Username:** \`${creator.tag}\``
            ] : [
                `> *Unknown Executor*`
            ]),
            ``,
            `### Sticker Details`,
            `> **Name:** \`${sticker.name}\``,
            `> **Sticker ID:** \`${sticker.id}\``,
            `> **Description:** \`${sticker.description || "No description"}\``,
            `> **Format:** \`${getStickerFormatName(sticker.format)}\``,
            `> **Tags:** \`${sticker.tags || "None"}\``,
            `> **Available:** \`${sticker.available ? "Yes" : "No"}\``,
            `> **URL:** [View Sticker](${sticker.url})`,
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
                creator: creator ? {
                    id: creator.id,
                    username: creator.username,
                    tag: creator.tag
                } : null,
                creationTime: new Date().toISOString()
            }, null, 2),
            "StickerCreate"
        );
    }
};