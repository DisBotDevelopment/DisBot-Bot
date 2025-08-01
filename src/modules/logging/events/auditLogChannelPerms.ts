import {
    AuditLogEvent,
    Client,
    Events,
    GuildChannel,
    WebhookClient
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
        const guildId = oldChannel.guildId;
        const guild = client.guilds.cache.get(guildId);

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

        // Fetch the audit log entry for the channel update
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelUpdate
        });

        const logEntry = auditLogs.entries.first();
        if (!logEntry) return;

        const executor = logEntry.executor;

        // Compare permission overwrites
        const oldOverwrites = oldChannel.permissionOverwrites.cache;
        const newOverwrites = newChannel.permissionOverwrites.cache;

        const permissionUpdates: string[] = [];

        // Check for new additions or updates
        newOverwrites.forEach((perm, targetId) => {
            const oldPerm = oldOverwrites.get(targetId);

            let addedAllow: string[] = [];
            let addedDeny: string[] = [];
            let isNew = false;

            if (!oldPerm) {
                // New overwrite added
                isNew = true;
                addedAllow = perm.allow.toArray();
                addedDeny = perm.deny.toArray();
            } else {
                // Check for updates to existing overwrite
                addedAllow = perm.allow.missing(oldPerm.allow);
                addedDeny = perm.deny.missing(oldPerm.deny);
            }

            if (addedAllow.length === 0 && addedDeny.length === 0 && !isNew) return; // Skip if no updates

            const target = guild?.roles.cache.get(targetId) || guild?.members.cache.get(targetId);
            const targetType = guild?.roles.cache.get(targetId) ? "Role" : "User";
            const targetMention = target ? (targetType === "Role" ? `<@&${targetId}>` : `<@${targetId}>`) : targetId;

            permissionUpdates.push(
                `### ${isNew ? "New Permission Added" : "Permission Updated"}`,
                `> - **Target**: ${targetMention} (${targetId})`,
                `> - **Type**: ${targetType}`,
                `> - **Allowed**: \`${addedAllow.join(", ") || "No changes"}\``,
                `> - **Denied**: \`${addedDeny.join(", ") || "No changes"}\``,
                ``
            );
        });

        // Check for removed permissions
        oldOverwrites.forEach((perm, targetId) => {
            if (!newOverwrites.has(targetId)) {
                const target = guild?.roles.cache.get(targetId) || guild?.members.cache.get(targetId);
                const targetType = guild?.roles.cache.get(targetId) ? "Role" : "User";
                const targetMention = target ? (targetType === "Role" ? `<@&${targetId}>` : `<@${targetId}>`) : targetId;

                permissionUpdates.push(
                    `### Permission Removed`,
                    `> - **Target**: ${targetMention} (${targetId})`,
                    `> - **Type**: ${targetType}`,
                    `> - **Previously Allowed**: \`${perm.allow.toArray().join(", ") || "None"}\``,
                    `> - **Previously Denied**: \`${perm.deny.toArray().join(", ") || "None"}\``,
                    ``
                );
            }
        });

        if (permissionUpdates.length === 0) return;

        await loggingHelper(client,
            [
                `### Channel Updated: ${newChannel.name} (${newChannel.id})`,
                `> - **Type**: ${newChannel.type}`,
                `> - **Position**: ${newChannel.position}`,
                ``,
                ...permissionUpdates,
                `- **Executor**: @${executor?.tag}`
            ].join("\n"),
            webhook,
            JSON.stringify({
                oldChannel: {
                    name: oldChannel.name,
                    type: oldChannel.type,
                    position: oldChannel.position,
                    permissionOverwrites: oldChannel.permissionOverwrites.cache.map(ow => ({
                        id: ow.id,
                        type: ow.type,
                        allow: ow.allow.toArray(),
                        deny: ow.deny.toArray()
                    }))
                },
                newChannel: {
                    name: newChannel.name,
                    type: newChannel.type,
                    position: newChannel.position,
                    permissionOverwrites: newChannel.permissionOverwrites.cache.map(ow => ({
                        id: ow.id,
                        type: ow.type,
                        allow: ow.allow.toArray(),
                        deny: ow.deny.toArray()
                    }))
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