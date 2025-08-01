import {
    AuditLogEvent,
    EmbedBuilder,
    Events,
    GuildMember,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildMemberUpdate,

    async execute(
        oldMember: GuildMember,
        newMember: GuildMember,
        client: ExtendedClient
    ) {
        const guild = newMember.guild;

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

        try {
            // Track all changes
            const changes: string[] = [];
            let title = "Member Updated";
            let requiresAuditLog = false;

            // Nickname change
            if (oldMember.nickname !== newMember.nickname) {
                changes.push(
                    `> **Nickname**: \`${oldMember.nickname || "None"}\` → \`${newMember.nickname || "None"}\``
                );
                title = "Nickname Changed";
            }

            // Role changes
            const addedRoles = newMember.roles.cache.filter(
                role => !oldMember.roles.cache.has(role.id)
            );
            const removedRoles = oldMember.roles.cache.filter(
                role => !newMember.roles.cache.has(role.id)
            );

            if (addedRoles.size > 0) {
                changes.push(
                    `> **Roles Added**: ${addedRoles.map(r => r.toString()).join(", ")}`
                );
                title = "Roles Updated";
                requiresAuditLog = true;
            }

            if (removedRoles.size > 0) {
                changes.push(
                    `> **Roles Removed**: ${removedRoles.map(r => r.toString()).join(", ")}`
                );
                title = "Roles Updated";
                requiresAuditLog = true;
            }

            // Timeout changes
            if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) {
                const oldTimeout = oldMember.communicationDisabledUntil
                    ? `<t:${Math.floor(oldMember.communicationDisabledUntilTimestamp! / 1000)}:R>`
                    : "None";
                const newTimeout = newMember.communicationDisabledUntil
                    ? `<t:${Math.floor(newMember.communicationDisabledUntilTimestamp! / 1000)}:R>`
                    : "None";

                changes.push(
                    `> **Timeout**: ${oldTimeout} → ${newTimeout}`
                );
                title = "Timeout Updated";
                requiresAuditLog = true;
            }

            // If no changes detected, exit
            if (changes.length === 0) return;

            // Get audit log details if needed
            let executor = null;
            if (requiresAuditLog) {
                const auditLogs = await guild.fetchAuditLogs({
                    type: AuditLogEvent.MemberUpdate,
                    limit: 5
                }).catch(() => null);

                if (auditLogs) {
                    const relevantEntry = auditLogs.entries.find(
                        entry => entry.target?.id === newMember.id &&
                            entry.createdTimestamp > Date.now() - 5000
                    );
                    executor = relevantEntry?.executor;
                }
            }

            // Prepare the log message
            const messageContent = [
                `### ${title}`,
                ``,
                `> **Member**: ${newMember.user.toString()} (\`${newMember.id}\`)`,
                ``,
                ...changes,
                ``,
                executor ? `- **Modified by**: ${executor.toString()}` : ''
            ].filter(Boolean).join("\n");

            // Prepare the JSON data
            const jsonData = {
                member: {
                    id: newMember.id,
                    username: newMember.user.username,
                    tag: newMember.user.tag,
                    avatarURL: newMember.user.displayAvatarURL()
                },
                changes: {
                    nickname: oldMember.nickname !== newMember.nickname,
                    roles: addedRoles.size > 0 || removedRoles.size > 0,
                    timeout: oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp
                },
                details: {
                    oldNickname: oldMember.nickname,
                    newNickname: newMember.nickname,
                    addedRoles: addedRoles.map(r => r.id),
                    removedRoles: removedRoles.map(r => r.id),
                    oldTimeout: oldMember.communicationDisabledUntil?.toISOString(),
                    newTimeout: newMember.communicationDisabledUntil?.toISOString()
                },
                executor: executor ? {
                    id: executor.id,
                    username: executor.username,
                    tag: executor.tag,
                    avatarURL: executor.displayAvatarURL()
                } : null,
                updateTime: new Date().toISOString()
            };

            await loggingHelper(client,
                messageContent,
                webhook,
                JSON.stringify(jsonData, null, 2),
                "MemberUpdate"
            );
        } catch (error) {
            console.error("Error processing member update:", error);
        }
    }
};