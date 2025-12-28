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
    name: Events.GuildStickerUpdate,

    async execute(
        oldSticker: Sticker,
        newSticker: Sticker,
        client: ExtendedClient
    ) {
        const guild = newSticker.guild;
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
            type: AuditLogEvent.StickerUpdate,
            limit: 1
        }).catch(() => null);

        const updater = auditLogs?.entries.first()?.executor;

        const changes: string[] = [];

        if (oldSticker.name !== newSticker.name) {
            changes.push(
                `> **Name**`,
                `> Before: \`${oldSticker.name}\``,
                `> After: \`${newSticker.name}\``
            );
        }

        if (oldSticker.description !== newSticker.description) {
            const oldDesc = oldSticker.description || "No description";
            const newDesc = newSticker.description || "No description";
            changes.push(
                `> **Description**`,
                `> Before: \`${oldDesc}\``,
                `> After: \`${newDesc}\``
            );
        }

        if (oldSticker.tags !== newSticker.tags) {
            changes.push(
                `> **Tags**`,
                `> Before: \`${oldSticker.tags || "None"}\``,
                `> After: \`${newSticker.tags || "None"}\``
            );
        }

        if (oldSticker.available !== newSticker.available) {
            changes.push(
                `> **Available**`,
                `> Before: \`${oldSticker.available ? "Yes" : "No"}\``,
                `> After: \`${newSticker.available ? "Yes" : "No"}\``
            );
        }

        if (changes.length === 0) return;

        const message = [
            `### 🔄 Sticker Updated`,
            ``,
            `### Executor`,
            ...(updater ? [
                `> <@${updater.id}>`,
                `> **User ID:** \`${updater.id}\``,
                `> **Username:** \`${updater.tag}\``
            ] : [
                `> *Unknown Executor*`
            ]),
            ``,
            `### Sticker Details`,
            `> **Name:** \`${newSticker.name}\``,
            `> **Sticker ID:** \`${newSticker.id}\``,
            `> **URL:** [View Sticker](${newSticker.url})`,
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
                oldSticker: {
                    id: oldSticker.id,
                    name: oldSticker.name,
                    description: oldSticker.description,
                    format: getStickerFormatName(oldSticker.format),
                    tags: oldSticker.tags,
                    url: oldSticker.url,
                    createdAt: new Date(oldSticker.createdTimestamp).toISOString(),
                    available: oldSticker.available,
                    guildId: oldSticker.guildId
                },
                newSticker: {
                    id: newSticker.id,
                    name: newSticker.name,
                    description: newSticker.description,
                    format: getStickerFormatName(newSticker.format),
                    tags: newSticker.tags,
                    url: newSticker.url,
                    createdAt: new Date(newSticker.createdTimestamp).toISOString(),
                    available: newSticker.available,
                    guildId: newSticker.guildId
                },
                changes: {
                    name: oldSticker.name !== newSticker.name,
                    description: oldSticker.description !== newSticker.description,
                    tags: oldSticker.tags !== newSticker.tags,
                    available: oldSticker.available !== newSticker.available
                },
                updater: updater ? {
                    id: updater.id,
                    username: updater.username,
                    tag: updater.tag
                } : null,
                updateTime: new Date().toISOString()
            }, null, 2),
            "StickerUpdate"
        );
    }
};