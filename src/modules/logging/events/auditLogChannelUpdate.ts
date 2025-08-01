import {
    AuditLogEvent,
    ChannelFlags,
    Client,
    Events,
    GuildChannel,
    TextChannel,
    VoiceChannel, WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.ChannelUpdate,

    async execute(
        oldChannel: GuildChannel,
        newChannel: GuildChannel,
        client: ExtendedClient
    ) {
        const guildId = newChannel.guild.id;
        const guild = newChannel.guild;

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

        // Fetch audit logs
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelUpdate
        });
        const logEntry = auditLogs.entries.first();
        const executor = logEntry?.executor;

        // Track all changes
        const changes: string[] = [];

        // Channel name change
        if (oldChannel.name !== newChannel.name) {
            changes.push(
                `> **Name**: \`${oldChannel.name || "None"}\` → \`${newChannel.name || "None"}\``
            );
        }

        // Channel type change
        if (oldChannel.type !== newChannel.type) {
            const typeMap: Record<number, string> = {
                0: "Text",
                2: "Voice",
                4: "Category",
                5: "Announcement",
                13: "Stage",
                15: "Forum"
            };
            changes.push(
                `> **Type**: \`${typeMap[oldChannel.type] || "Unknown"}\` → \`${typeMap[newChannel.type] || "Unknown"}\``
            );
        }

        // Text channel specific changes
        if (newChannel instanceof TextChannel && oldChannel instanceof TextChannel) {
            // Topic change
            if (oldChannel.topic !== newChannel.topic) {
                changes.push(
                    `> **Topic**: \`${oldChannel.topic?.substring(0, 50) || "None"}\` → \`${newChannel.topic?.substring(0, 50) || "None"}\``
                );
            }

            // NSFW change
            if (oldChannel.nsfw !== newChannel.nsfw) {
                changes.push(
                    `> **NSFW**: \`${oldChannel.nsfw ? "Yes" : "No"}\` → \`${newChannel.nsfw ? "Yes" : "No"}\``
                );
            }

            // Rate limit change
            if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
                changes.push(
                    `> **Slowmode**: \`${oldChannel.rateLimitPerUser || 0}s\` → \`${newChannel.rateLimitPerUser || 0}s\``
                );
            }

            // Auto archive duration change
            if (oldChannel.defaultAutoArchiveDuration !== newChannel.defaultAutoArchiveDuration) {
                changes.push(
                    `> **Auto Archive**: \`${oldChannel.defaultAutoArchiveDuration || "None"}\` → \`${newChannel.defaultAutoArchiveDuration || "None"}\``
                );
            }
        }

        // Voice channel specific changes
        if (newChannel instanceof VoiceChannel && oldChannel instanceof VoiceChannel) {
            // Bitrate change
            if (oldChannel.bitrate !== newChannel.bitrate) {
                changes.push(
                    `> **Bitrate**: \`${oldChannel.bitrate}kbps\` → \`${newChannel.bitrate}kbps\``
                );
            }

            // User limit change
            if (oldChannel.userLimit !== newChannel.userLimit) {
                changes.push(
                    `> **User Limit**: \`${oldChannel.userLimit || "None"}\` → \`${newChannel.userLimit || "None"}\``
                );
            }

            // Video quality change
            if (oldChannel.videoQualityMode !== newChannel.videoQualityMode) {
                changes.push(
                    `> **Video Quality**: \`${oldChannel.videoQualityMode}\` → \`${newChannel.videoQualityMode}\``
                );
            }
        }

        // Parent channel change
        if (oldChannel.parentId !== newChannel.parentId) {
            changes.push(
                `> **Parent**: \`${oldChannel.parent?.name || "None"}\` → \`${newChannel.parent?.name || "None"}\``
            );
        }

        // Position change
        if (oldChannel.position !== newChannel.position) {
            changes.push(
                `> **Position**: \`${oldChannel.position}\` → \`${newChannel.position}\``
            );
        }

        if (oldChannel.flags !== newChannel.flags) {
            const oldFlags: string[] = [];
            const newFlags: string[] = [];

            Object.keys(ChannelFlags).forEach((flag: string) => {
                if (oldChannel.flags.has(ChannelFlags[flag])) {
                    oldFlags.push(flag);
                }
                if (newChannel.flags.has(ChannelFlags[flag])) {
                    newFlags.push(flag);
                }
            });

            changes.push(
                `> **Flags**: \`${oldFlags.join(", ") || "None"}\` → \`${newFlags.join(", ") || "None"}\``
            );
        }

        // If no changes were detected
        if (changes.length === 0) {
            changes.push("> No detectable changes were found");
        }

        await loggingHelper(client,
            [
                `### Channel Updated: ${newChannel.name} (${newChannel.id})`,
                `> **Type**: ${newChannel.type}`,
                ``,
                ...changes,
                ``,
                `- **Executor**: @${executor?.tag}`
            ].join("\n"),
            webhook,
            JSON.stringify({
                oldChannel: {
                    name: oldChannel.name,
                    type: oldChannel.type,
                    parentId: oldChannel.parentId,
                    position: oldChannel.position,
                    flags: [...oldChannel.flags],
                    ...(oldChannel instanceof TextChannel ? {
                        topic: oldChannel.topic,
                        nsfw: oldChannel.nsfw,
                        rateLimitPerUser: oldChannel.rateLimitPerUser,
                        defaultAutoArchiveDuration: oldChannel.defaultAutoArchiveDuration
                    } : {}),
                    ...(oldChannel instanceof VoiceChannel ? {
                        bitrate: oldChannel.bitrate,
                        userLimit: oldChannel.userLimit,
                        videoQualityMode: oldChannel.videoQualityMode
                    } : {})
                },
                newChannel: {
                    name: newChannel.name,
                    type: newChannel.type,
                    parentId: newChannel.parentId,
                    position: newChannel.position,
                    flags: [...newChannel.flags],
                    ...(newChannel instanceof TextChannel ? {
                        topic: newChannel.topic,
                        nsfw: newChannel.nsfw,
                        rateLimitPerUser: newChannel.rateLimitPerUser,
                        defaultAutoArchiveDuration: newChannel.defaultAutoArchiveDuration
                    } : {}),
                    ...(newChannel instanceof VoiceChannel ? {
                        bitrate: newChannel.bitrate,
                        userLimit: newChannel.userLimit,
                        videoQualityMode: newChannel.videoQualityMode
                    } : {})
                },
                executor: executor ? {
                    id: executor.id,
                    username: executor.username,
                    tag: executor.tag
                } : null
            }),
            "ChannelUpdate"
        );
    }
};