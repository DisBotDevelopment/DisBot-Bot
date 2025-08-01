import {
    AuditLogEvent,
    Events,
    Guild,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildUpdate,

    async execute(oldGuild: Guild, newGuild: Guild, client: ExtendedClient) {
        const guild = newGuild;

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

        // Get guild updater from audit logs
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.GuildUpdate,
            limit: 1
        }).catch(() => null);

        const updater = auditLogs?.entries.first()?.executor;

        // Track all changes between old and new guild
        const changes: string[] = [];

        // Helper function to format verification level
        const formatVerificationLevel = (level: number) => {
            const levels = [
                "None",
                "Low",
                "Medium",
                "High",
                "Very High"
            ];
            return levels[level] || `Unknown (${level})`;
        };

        // Check each property for changes
        if (oldGuild.name !== newGuild.name) {
            changes.push(`> **Name**: \`${oldGuild.name}\` → \`${newGuild.name}\``);
        }

        if (oldGuild.icon !== newGuild.icon) {
            changes.push(`> **Icon**: ${newGuild.iconURL() ? `[New Icon](${newGuild.iconURL()})` : "Removed"}`);
        }

        if (oldGuild.banner !== newGuild.banner) {
            changes.push(`> **Banner**: ${newGuild.bannerURL() ? `[New Banner](${newGuild.bannerURL()})` : "Removed"}`);
        }

        if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
            changes.push(`> **AFK Channel**: ${oldGuild.afkChannel?.toString() || "None"} → ${newGuild.afkChannel?.toString() || "None"}`);
        }

        if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
            changes.push(`> **AFK Timeout**: \`${oldGuild.afkTimeout / 60} mins\` → \`${newGuild.afkTimeout / 60} mins\``);
        }

        if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
            changes.push(`> **Verification**: \`${formatVerificationLevel(oldGuild.verificationLevel)}\` → \`${formatVerificationLevel(newGuild.verificationLevel)}\``);
        }

        if (oldGuild.systemChannelId !== newGuild.systemChannelId) {
            changes.push(`> **System Channel**: ${oldGuild.systemChannel?.toString() || "None"} → ${newGuild.systemChannel?.toString() || "None"}`);
        }

        if (oldGuild.rulesChannelId !== newGuild.rulesChannelId) {
            changes.push(`> **Rules Channel**: ${oldGuild.rulesChannel?.toString() || "None"} → ${newGuild.rulesChannel?.toString() || "None"}`);
        }

        if (oldGuild.publicUpdatesChannelId !== newGuild.publicUpdatesChannelId) {
            changes.push(`> **Updates Channel**: ${oldGuild.publicUpdatesChannel?.toString() || "None"} → ${newGuild.publicUpdatesChannel?.toString() || "None"}`);
        }

        if (oldGuild.systemChannelFlags !== newGuild.systemChannelFlags) {
            changes.push(`> **System Flags**: \`${oldGuild.systemChannelFlags.bitfield}\` → \`${newGuild.systemChannelFlags.bitfield}\``);
        }

        if (oldGuild.premiumTier !== newGuild.premiumTier) {
            changes.push(`> **Boost Tier**: \`${oldGuild.premiumTier}\` → \`${newGuild.premiumTier}\``);
        }

        // If no changes detected (shouldn't happen for this event)
        if (changes.length === 0) {
            changes.push("> No detectable changes were found");
        }

        // Prepare the log message
        const messageContent = [
            `### Guild Settings Updated`,
            ``,
            `> **Guild**: ${newGuild.name} (\`${newGuild.id}\`)`,
            ``,
            ...changes,
            ``,
            `- **Updated by**: ${updater ? `@${updater.tag}` : "Unknown"}`,
            `- **Updated at**: \`${new Date().toLocaleString()}\``
        ].join("\n");

        // Prepare the JSON data
        const jsonData = {
            oldGuild: {
                name: oldGuild.name,
                icon: oldGuild.icon,
                banner: oldGuild.banner,
                afkChannelId: oldGuild.afkChannelId,
                afkTimeout: oldGuild.afkTimeout,
                verificationLevel: oldGuild.verificationLevel,
                systemChannelId: oldGuild.systemChannelId,
                rulesChannelId: oldGuild.rulesChannelId,
                publicUpdatesChannelId: oldGuild.publicUpdatesChannelId,
                systemChannelFlags: oldGuild.systemChannelFlags.bitfield,
                premiumTier: oldGuild.premiumTier,
                features: oldGuild.features
            },
            newGuild: {
                name: newGuild.name,
                icon: newGuild.icon,
                banner: newGuild.banner,
                afkChannelId: newGuild.afkChannelId,
                afkTimeout: newGuild.afkTimeout,
                verificationLevel: newGuild.verificationLevel,
                systemChannelId: newGuild.systemChannelId,
                rulesChannelId: newGuild.rulesChannelId,
                publicUpdatesChannelId: newGuild.publicUpdatesChannelId,
                systemChannelFlags: newGuild.systemChannelFlags.bitfield,
                premiumTier: newGuild.premiumTier,
                features: newGuild.features
            },
            changes: {
                name: oldGuild.name !== newGuild.name,
                icon: oldGuild.icon !== newGuild.icon,
                banner: oldGuild.banner !== newGuild.banner,
                afkChannel: oldGuild.afkChannelId !== newGuild.afkChannelId,
                afkTimeout: oldGuild.afkTimeout !== newGuild.afkTimeout,
                verificationLevel: oldGuild.verificationLevel !== newGuild.verificationLevel,
                systemChannel: oldGuild.systemChannelId !== newGuild.systemChannelId,
                rulesChannel: oldGuild.rulesChannelId !== newGuild.rulesChannelId,
                updatesChannel: oldGuild.publicUpdatesChannelId !== newGuild.publicUpdatesChannelId,
                systemFlags: oldGuild.systemChannelFlags !== newGuild.systemChannelFlags,
                premiumTier: oldGuild.premiumTier !== newGuild.premiumTier
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
            "GuildUpdate"
        );
    }
};