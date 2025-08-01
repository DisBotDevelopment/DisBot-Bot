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
    name: Events.GuildStickerUpdate,

    async execute(
        oldSticker: Sticker,
        newSticker: Sticker,
        client: ExtendedClient
    ) {
        const guild = newSticker.guild;
        if (!guild) {
            console.error("Guild not found for sticker:", newSticker.id);
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

        // Get sticker updater from audit logs
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.StickerUpdate,
            limit: 1
        }).catch(() => null);

        const updater = auditLogs?.entries.first()?.executor;

        // Track changes between old and new sticker
        const changes: string[] = [];

        if (oldSticker.name !== newSticker.name) {
            changes.push(`> **Name**: \`${oldSticker.name}\` → \`${newSticker.name}\``);
        }

        if (oldSticker.description !== newSticker.description) {
            const oldDesc = oldSticker.description || "No description";
            const newDesc = newSticker.description || "No description";
            changes.push(`> **Description**: \`${oldDesc}\` → \`${newDesc}\``);
        }

        if (oldSticker.tags !== newSticker.tags) {
            changes.push(`> **Tags**: \`${oldSticker.tags}\` → \`${newSticker.tags}\``);
        }

        // If no changes detected (shouldn't happen for this event)
        if (changes.length === 0) {
            changes.push("> No detectable changes were found");
        }

        // Prepare the log message
        const messageContent = [
            `### Sticker Updated: ${newSticker.name} (${newSticker.id})`,
            ``,
            ...changes,
            ``,
            `[View Sticker](${newSticker.url})`,
            ``,
            `- **Updated by**: ${updater ? `@${updater.tag}` : "Unknown"}`,
            `- **Updated at**: \`${new Date().toLocaleString()}\``
        ].join("\n");

        // Prepare the JSON data
        const jsonData = {
            oldSticker: {
                id: oldSticker.id,
                name: oldSticker.name,
                description: oldSticker.description,
                format: oldSticker.format,
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
                format: newSticker.format,
                tags: newSticker.tags,
                url: newSticker.url,
                createdAt: new Date(newSticker.createdTimestamp).toISOString(),
                available: newSticker.available,
                guildId: newSticker.guildId
            },
            changes: {
                name: oldSticker.name !== newSticker.name,
                description: oldSticker.description !== newSticker.description,
                tags: oldSticker.tags !== newSticker.tags
            },
            updater: updater ? {
                id: updater.id,
                username: updater.username,
                tag: updater.tag,
                avatarURL: updater.displayAvatarURL()
            } : null,
            updateTime: new Date().toISOString()
        };

        await loggingHelper(client,
            messageContent,
            webhook,
            JSON.stringify(jsonData, null, 2),
            "StickerUpdate"
        );
    }
};