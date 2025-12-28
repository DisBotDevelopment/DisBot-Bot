import {
    AuditLogEvent,
    Events,
    Guild,
    GuildVerificationLevel,
    GuildDefaultMessageNotifications,
    GuildExplicitContentFilter,
    GuildNSFWLevel,
    GuildPremiumTier,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

function getVerificationLevelName(level: GuildVerificationLevel): string {
    const levels: Record<GuildVerificationLevel, string> = {
        [GuildVerificationLevel.None]: "None",
        [GuildVerificationLevel.Low]: "Low",
        [GuildVerificationLevel.Medium]: "Medium",
        [GuildVerificationLevel.High]: "High",
        [GuildVerificationLevel.VeryHigh]: "Very High"
    };
    return levels[level] || `Unknown (${level})`;
}

function getNotificationLevelName(level: GuildDefaultMessageNotifications): string {
    const levels: Record<GuildDefaultMessageNotifications, string> = {
        [GuildDefaultMessageNotifications.AllMessages]: "All Messages",
        [GuildDefaultMessageNotifications.OnlyMentions]: "Only Mentions"
    };
    return levels[level] || `Unknown (${level})`;
}

function getExplicitContentFilterName(filter: GuildExplicitContentFilter): string {
    const filters: Record<GuildExplicitContentFilter, string> = {
        [GuildExplicitContentFilter.Disabled]: "Disabled",
        [GuildExplicitContentFilter.MembersWithoutRoles]: "Members Without Roles",
        [GuildExplicitContentFilter.AllMembers]: "All Members"
    };
    return filters[filter] || `Unknown (${filter})`;
}

function getNSFWLevelName(level: GuildNSFWLevel): string {
    const levels: Record<GuildNSFWLevel, string> = {
        [GuildNSFWLevel.Default]: "Default",
        [GuildNSFWLevel.Explicit]: "Explicit",
        [GuildNSFWLevel.Safe]: "Safe",
        [GuildNSFWLevel.AgeRestricted]: "Age Restricted"
    };
    return levels[level] || `Unknown (${level})`;
}

function getPremiumTierName(tier: GuildPremiumTier): string {
    const tiers: Record<GuildPremiumTier, string> = {
        [GuildPremiumTier.None]: "None (Level 0)",
        [GuildPremiumTier.Tier1]: "Level 1",
        [GuildPremiumTier.Tier2]: "Level 2",
        [GuildPremiumTier.Tier3]: "Level 3"
    };
    return tiers[tier] || `Unknown (${tier})`;
}

export default {
    name: Events.GuildUpdate,

    async execute(oldGuild: Guild, newGuild: Guild, client: ExtendedClient) {
        const guild = newGuild;

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
            type: AuditLogEvent.GuildUpdate,
            limit: 1
        }).catch(() => null);

        const updater = auditLogs?.entries.first()?.executor;

        const changes: string[] = [];

        if (oldGuild.name !== newGuild.name) {
            changes.push(
                `> **Name**`,
                `> Before: \`${oldGuild.name}\``,
                `> After: \`${newGuild.name}\``
            );
        }

        if (oldGuild.description !== newGuild.description) {
            changes.push(
                `> **Description**`,
                `> Before: \`${oldGuild.description || "None"}\``,
                `> After: \`${newGuild.description || "None"}\``
            );
        }

        if (oldGuild.icon !== newGuild.icon) {
            changes.push(
                `> **Icon**`,
                `> Before: ${oldGuild.iconURL() ? `[View Icon](${oldGuild.iconURL()})` : "\`None\`"}`,
                `> After: ${newGuild.iconURL() ? `[View Icon](${newGuild.iconURL()})` : "\`None\`"}`
            );
        }

        if (oldGuild.banner !== newGuild.banner) {
            changes.push(
                `> **Banner**`,
                `> Before: ${oldGuild.bannerURL() ? `[View Banner](${oldGuild.bannerURL()})` : "\`None\`"}`,
                `> After: ${newGuild.bannerURL() ? `[View Banner](${newGuild.bannerURL()})` : "\`None\`"}`
            );
        }

        if (oldGuild.splash !== newGuild.splash) {
            changes.push(
                `> **Invite Splash**`,
                `> Before: ${oldGuild.splashURL() ? `[View Splash](${oldGuild.splashURL()})` : "\`None\`"}`,
                `> After: ${newGuild.splashURL() ? `[View Splash](${newGuild.splashURL()})` : "\`None\`"}`
            );
        }

        if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
            changes.push(
                `> **AFK Channel**`,
                `> Before: ${oldGuild.afkChannel ? `<#${oldGuild.afkChannelId}>` : "\`None\`"}`,
                `> After: ${newGuild.afkChannel ? `<#${newGuild.afkChannelId}>` : "\`None\`"}`
            );
        }

        if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
            changes.push(
                `> **AFK Timeout**`,
                `> Before: \`${oldGuild.afkTimeout / 60} minutes\``,
                `> After: \`${newGuild.afkTimeout / 60} minutes\``
            );
        }

        if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
            changes.push(
                `> **Verification Level**`,
                `> Before: \`${getVerificationLevelName(oldGuild.verificationLevel)}\``,
                `> After: \`${getVerificationLevelName(newGuild.verificationLevel)}\``
            );
        }

        if (oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications) {
            changes.push(
                `> **Default Notifications**`,
                `> Before: \`${getNotificationLevelName(oldGuild.defaultMessageNotifications)}\``,
                `> After: \`${getNotificationLevelName(newGuild.defaultMessageNotifications)}\``
            );
        }

        if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) {
            changes.push(
                `> **Explicit Content Filter**`,
                `> Before: \`${getExplicitContentFilterName(oldGuild.explicitContentFilter)}\``,
                `> After: \`${getExplicitContentFilterName(newGuild.explicitContentFilter)}\``
            );
        }

        if (oldGuild.nsfwLevel !== newGuild.nsfwLevel) {
            changes.push(
                `> **NSFW Level**`,
                `> Before: \`${getNSFWLevelName(oldGuild.nsfwLevel)}\``,
                `> After: \`${getNSFWLevelName(newGuild.nsfwLevel)}\``
            );
        }

        if (oldGuild.systemChannelId !== newGuild.systemChannelId) {
            changes.push(
                `> **System Channel**`,
                `> Before: ${oldGuild.systemChannel ? `<#${oldGuild.systemChannelId}>` : "\`None\`"}`,
                `> After: ${newGuild.systemChannel ? `<#${newGuild.systemChannelId}>` : "\`None\`"}`
            );
        }

        if (oldGuild.rulesChannelId !== newGuild.rulesChannelId) {
            changes.push(
                `> **Rules Channel**`,
                `> Before: ${oldGuild.rulesChannel ? `<#${oldGuild.rulesChannelId}>` : "\`None\`"}`,
                `> After: ${newGuild.rulesChannel ? `<#${newGuild.rulesChannelId}>` : "\`None\`"}`
            );
        }

        if (oldGuild.publicUpdatesChannelId !== newGuild.publicUpdatesChannelId) {
            changes.push(
                `> **Community Updates Channel**`,
                `> Before: ${oldGuild.publicUpdatesChannel ? `<#${oldGuild.publicUpdatesChannelId}>` : "\`None\`"}`,
                `> After: ${newGuild.publicUpdatesChannel ? `<#${newGuild.publicUpdatesChannelId}>` : "\`None\`"}`
            );
        }

        if (oldGuild.premiumTier !== newGuild.premiumTier) {
            changes.push(
                `> **Boost Tier**`,
                `> Before: \`${getPremiumTierName(oldGuild.premiumTier)}\``,
                `> After: \`${getPremiumTierName(newGuild.premiumTier)}\``
            );
        }

        if (oldGuild.premiumSubscriptionCount !== newGuild.premiumSubscriptionCount) {
            changes.push(
                `> **Boost Count**`,
                `> Before: \`${oldGuild.premiumSubscriptionCount || 0}\``,
                `> After: \`${newGuild.premiumSubscriptionCount || 0}\``
            );
        }

        if (oldGuild.preferredLocale !== newGuild.preferredLocale) {
            changes.push(
                `> **Preferred Locale**`,
                `> Before: \`${oldGuild.preferredLocale}\``,
                `> After: \`${newGuild.preferredLocale}\``
            );
        }

        if (changes.length === 0) return;

        const message = [
            `### ⚙️ Guild Settings Updated`,
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
            `### Guild`,
            `> **Name:** \`${newGuild.name}\``,
            `> **Guild ID:** \`${newGuild.id}\``,
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
                oldGuild: {
                    name: oldGuild.name,
                    description: oldGuild.description,
                    icon: oldGuild.icon,
                    banner: oldGuild.banner,
                    splash: oldGuild.splash,
                    afkChannelId: oldGuild.afkChannelId,
                    afkTimeout: oldGuild.afkTimeout,
                    verificationLevel: getVerificationLevelName(oldGuild.verificationLevel),
                    defaultMessageNotifications: getNotificationLevelName(oldGuild.defaultMessageNotifications),
                    explicitContentFilter: getExplicitContentFilterName(oldGuild.explicitContentFilter),
                    nsfwLevel: getNSFWLevelName(oldGuild.nsfwLevel),
                    systemChannelId: oldGuild.systemChannelId,
                    rulesChannelId: oldGuild.rulesChannelId,
                    publicUpdatesChannelId: oldGuild.publicUpdatesChannelId,
                    premiumTier: getPremiumTierName(oldGuild.premiumTier),
                    premiumSubscriptionCount: oldGuild.premiumSubscriptionCount,
                    preferredLocale: oldGuild.preferredLocale,
                    features: oldGuild.features
                },
                newGuild: {
                    name: newGuild.name,
                    description: newGuild.description,
                    icon: newGuild.icon,
                    banner: newGuild.banner,
                    splash: newGuild.splash,
                    afkChannelId: newGuild.afkChannelId,
                    afkTimeout: newGuild.afkTimeout,
                    verificationLevel: getVerificationLevelName(newGuild.verificationLevel),
                    defaultMessageNotifications: getNotificationLevelName(newGuild.defaultMessageNotifications),
                    explicitContentFilter: getExplicitContentFilterName(newGuild.explicitContentFilter),
                    nsfwLevel: getNSFWLevelName(newGuild.nsfwLevel),
                    systemChannelId: newGuild.systemChannelId,
                    rulesChannelId: newGuild.rulesChannelId,
                    publicUpdatesChannelId: newGuild.publicUpdatesChannelId,
                    premiumTier: getPremiumTierName(newGuild.premiumTier),
                    premiumSubscriptionCount: newGuild.premiumSubscriptionCount,
                    preferredLocale: newGuild.preferredLocale,
                    features: newGuild.features
                },
                updater: updater ? {
                    id: updater.id,
                    username: updater.username,
                    tag: updater.tag
                } : null,
                updateTime: new Date().toISOString()
            }, null, 2),
            "GuildUpdate"
        );
    }
};