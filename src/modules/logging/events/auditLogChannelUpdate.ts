import {
    AuditLogEvent,
    ChannelFlags,
    ChannelType,
    Events,
    GuildChannel,
    TextChannel,
    VideoQualityMode,
    VoiceChannel,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

function getChannelTypeName(type: ChannelType): string {
    const types: Record<ChannelType, string> = {
        [ChannelType.GuildText]: "Text Channel",
        [ChannelType.GuildVoice]: "Voice Channel",
        [ChannelType.GuildCategory]: "Category",
        [ChannelType.GuildAnnouncement]: "Announcement Channel",
        [ChannelType.AnnouncementThread]: "Announcement Thread",
        [ChannelType.PublicThread]: "Public Thread",
        [ChannelType.PrivateThread]: "Private Thread",
        [ChannelType.GuildStageVoice]: "Stage Channel",
        [ChannelType.GuildDirectory]: "Directory",
        [ChannelType.GuildForum]: "Forum Channel",
        [ChannelType.GuildMedia]: "Media Channel",
        [ChannelType.DM]: "DM",
        [ChannelType.GroupDM]: "Group DM"
    };
    return types[type] || `Unknown (${type})`;
}

function getVideoQualityName(mode: VideoQualityMode | null): string {
    if (mode === null) return "Auto";
    const modes: Record<VideoQualityMode, string> = {
        [VideoQualityMode.Auto]: "Auto",
        [VideoQualityMode.Full]: "720p"
    };
    return modes[mode] || `Unknown (${mode})`;
}

function formatPermissionName(permission: string): string {
    return permission
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function formatAutoArchiveDuration(duration: number | null): string {
    if (!duration) return "None";
    const hours = duration / 60;
    if (hours < 24) return `${hours} hours`;
    return `${hours / 24} days`;
}

export default {
    name: Events.ChannelUpdate,

    async execute(
        oldChannel: GuildChannel,
        newChannel: GuildChannel,
        client: ExtendedClient
    ) {
        const guildId = newChannel.guild.id;
        const guild = newChannel.guild;

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

        if (!loggingData || !loggingData.Channel) return;

        const webhook = new WebhookClient({url: loggingData.Channel});

        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelUpdate
        });
        const logEntry = auditLogs.entries.first();
        const executor = logEntry?.executor;

        const changes: string[] = [];

        if (oldChannel.name !== newChannel.name) {
            changes.push(
                `> **Name**`,
                `> Before: \`${oldChannel.name}\``,
                `> After: \`${newChannel.name}\``
            );
        }

        if (oldChannel.type !== newChannel.type) {
            changes.push(
                `> **Type**`,
                `> Before: \`${getChannelTypeName(oldChannel.type)}\``,
                `> After: \`${getChannelTypeName(newChannel.type)}\``
            );
        }

        if (newChannel instanceof TextChannel && oldChannel instanceof TextChannel) {
            if (oldChannel.topic !== newChannel.topic) {
                changes.push(
                    `> **Topic**`,
                    `> Before: \`${oldChannel.topic?.substring(0, 100) || "None"}\``,
                    `> After: \`${newChannel.topic?.substring(0, 100) || "None"}\``
                );
            }

            if (oldChannel.nsfw !== newChannel.nsfw) {
                changes.push(
                    `> **NSFW**`,
                    `> Before: \`${oldChannel.nsfw ? "Yes" : "No"}\``,
                    `> After: \`${newChannel.nsfw ? "Yes" : "No"}\``
                );
            }

            if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
                changes.push(
                    `> **Slowmode**`,
                    `> Before: \`${oldChannel.rateLimitPerUser || 0} seconds\``,
                    `> After: \`${newChannel.rateLimitPerUser || 0} seconds\``
                );
            }

            if (oldChannel.defaultAutoArchiveDuration !== newChannel.defaultAutoArchiveDuration) {
                changes.push(
                    `> **Auto Archive**`,
                    `> Before: \`${formatAutoArchiveDuration(oldChannel.defaultAutoArchiveDuration)}\``,
                    `> After: \`${formatAutoArchiveDuration(newChannel.defaultAutoArchiveDuration)}\``
                );
            }
        }

        if (newChannel instanceof VoiceChannel && oldChannel instanceof VoiceChannel) {
            if (oldChannel.bitrate !== newChannel.bitrate) {
                changes.push(
                    `> **Bitrate**`,
                    `> Before: \`${oldChannel.bitrate / 1000} kbps\``,
                    `> After: \`${newChannel.bitrate / 1000} kbps\``
                );
            }

            if (oldChannel.userLimit !== newChannel.userLimit) {
                changes.push(
                    `> **User Limit**`,
                    `> Before: \`${oldChannel.userLimit || "Unlimited"}\``,
                    `> After: \`${newChannel.userLimit || "Unlimited"}\``
                );
            }

            if (oldChannel.videoQualityMode !== newChannel.videoQualityMode) {
                changes.push(
                    `> **Video Quality**`,
                    `> Before: \`${getVideoQualityName(oldChannel.videoQualityMode)}\``,
                    `> After: \`${getVideoQualityName(newChannel.videoQualityMode)}\``
                );
            }
        }

        if (oldChannel.parentId !== newChannel.parentId) {
            changes.push(
                `> **Category**`,
                `> Before: \`${oldChannel.parent?.name || "None"}\``,
                `> After: \`${newChannel.parent?.name || "None"}\``
            );
        }

        if (oldChannel.position !== newChannel.position) {
            changes.push(
                `> **Position**`,
                `> Before: \`${oldChannel.position}\``,
                `> After: \`${newChannel.position}\``
            );
        }

        if (oldChannel.flags.bitfield !== newChannel.flags.bitfield) {
            const oldFlags: string[] = [];
            const newFlags: string[] = [];

            for (const [flagName, flagValue] of Object.entries(ChannelFlags)) {
                if (typeof flagValue === 'number') {
                    if (oldChannel.flags.has(flagValue)) {
                        oldFlags.push(formatPermissionName(flagName));
                    }
                    if (newChannel.flags.has(flagValue)) {
                        newFlags.push(formatPermissionName(flagName));
                    }
                }
            }

            changes.push(
                `> **Flags**`,
                `> Before: \`${oldFlags.join(", ") || "None"}\``,
                `> After: \`${newFlags.join(", ") || "None"}\``
            );
        }

        const oldOverwrites = oldChannel.permissionOverwrites.cache;
        const newOverwrites = newChannel.permissionOverwrites.cache;
        const permissionChanges: string[] = [];

        newOverwrites.forEach((perm, targetId) => {
            const oldPerm = oldOverwrites.get(targetId);

            let addedAllow: string[] = [];
            let addedDeny: string[] = [];
            let isNew = false;

            if (!oldPerm) {
                isNew = true;
                addedAllow = perm.allow.toArray();
                addedDeny = perm.deny.toArray();
            } else {
                addedAllow = perm.allow.missing(oldPerm.allow);
                addedDeny = perm.deny.missing(oldPerm.deny);
            }

            if (addedAllow.length === 0 && addedDeny.length === 0 && !isNew) return;

            const target = guild?.roles.cache.get(targetId) || guild?.members.cache.get(targetId);
            const targetType = guild?.roles.cache.get(targetId) ? "Role" : "User";
            const targetMention = target ? (targetType === "Role" ? `<@&${targetId}>` : `<@${targetId}>`) : targetId;

            const formattedAllow = addedAllow.map(p => formatPermissionName(p)).join(", ") || "No changes";
            const formattedDeny = addedDeny.map(p => formatPermissionName(p)).join(", ") || "No changes";

            permissionChanges.push(
                ``,
                `> **${isNew ? "New Permission" : "Permission Updated"}** (${targetType})`,
                `> Target: ${targetMention}`,
                `> Allowed: \`${formattedAllow}\``,
                `> Denied: \`${formattedDeny}\``
            );
        });

        oldOverwrites.forEach((perm, targetId) => {
            if (!newOverwrites.has(targetId)) {
                const target = guild?.roles.cache.get(targetId) || guild?.members.cache.get(targetId);
                const targetType = guild?.roles.cache.get(targetId) ? "Role" : "User";
                const targetMention = target ? (targetType === "Role" ? `<@&${targetId}>` : `<@${targetId}>`) : targetId;

                const formattedAllow = perm.allow.toArray().map(p => formatPermissionName(p)).join(", ") || "None";
                const formattedDeny = perm.deny.toArray().map(p => formatPermissionName(p)).join(", ") || "None";

                permissionChanges.push(
                    ``,
                    `> **Permission Removed** (${targetType})`,
                    `> Target: ${targetMention}`,
                    `> Previously Allowed: \`${formattedAllow}\``,
                    `> Previously Denied: \`${formattedDeny}\``
                );
            }
        });

        if (changes.length === 0 && permissionChanges.length === 0) return;

        const message = [
            `### 🔄 Channel Updated`,
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
            `### Channel Details`,
            `> **Channel:** <#${newChannel.id}> (\`${newChannel.name}\`)`,
            `> **Channel ID:** \`${newChannel.id}\``,
            `> **Type:** \`${getChannelTypeName(newChannel.type)}\``,
            ``,
            ...(changes.length > 0 ? [
                `### Changes`,
                ...changes,
                ``
            ] : []),
            ...(permissionChanges.length > 0 ? [
                `### Permission Changes`,
                ...permissionChanges,
                ``
            ] : []),
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify({
                oldChannel: {
                    name: oldChannel.name,
                    type: getChannelTypeName(oldChannel.type),
                    parentId: oldChannel.parentId,
                    position: oldChannel.position,
                    flags: [...oldChannel.flags].map(f => formatPermissionName(String(f))),
                    ...(oldChannel instanceof TextChannel ? {
                        topic: oldChannel.topic,
                        nsfw: oldChannel.nsfw,
                        rateLimitPerUser: oldChannel.rateLimitPerUser,
                        defaultAutoArchiveDuration: oldChannel.defaultAutoArchiveDuration
                    } : {}),
                    ...(oldChannel instanceof VoiceChannel ? {
                        bitrate: oldChannel.bitrate,
                        userLimit: oldChannel.userLimit,
                        videoQualityMode: getVideoQualityName(oldChannel.videoQualityMode)
                    } : {}),
                    permissionOverwrites: oldChannel.permissionOverwrites.cache.map(ow => ({
                        id: ow.id,
                        type: ow.type,
                        allow: ow.allow.toArray().map(p => formatPermissionName(p)),
                        deny: ow.deny.toArray().map(p => formatPermissionName(p))
                    }))
                },
                newChannel: {
                    name: newChannel.name,
                    type: getChannelTypeName(newChannel.type),
                    parentId: newChannel.parentId,
                    position: newChannel.position,
                    flags: [...newChannel.flags].map(f => formatPermissionName(String(f))),
                    ...(newChannel instanceof TextChannel ? {
                        topic: newChannel.topic,
                        nsfw: newChannel.nsfw,
                        rateLimitPerUser: newChannel.rateLimitPerUser,
                        defaultAutoArchiveDuration: newChannel.defaultAutoArchiveDuration
                    } : {}),
                    ...(newChannel instanceof VoiceChannel ? {
                        bitrate: newChannel.bitrate,
                        userLimit: newChannel.userLimit,
                        videoQualityMode: getVideoQualityName(newChannel.videoQualityMode)
                    } : {}),
                    permissionOverwrites: newChannel.permissionOverwrites.cache.map(ow => ({
                        id: ow.id,
                        type: ow.type,
                        allow: ow.allow.toArray().map(p => formatPermissionName(p)),
                        deny: ow.deny.toArray().map(p => formatPermissionName(p))
                    }))
                },
                executor: executor ? {
                    id: executor.id,
                    username: executor.username,
                    tag: executor.tag
                } : null
            }, null, 2),
            "ChannelUpdate"
        );
    }
};