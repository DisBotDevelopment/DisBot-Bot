import {
    AuditLogEvent,
    Events,
    GuildMember,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
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

        try {
            const changes: string[] = [];
            let requiresAuditLog = false;

            if (oldMember.nickname !== newMember.nickname) {
                changes.push(
                    `> **Nickname**`,
                    `> Before: \`${oldMember.nickname || "None"}\``,
                    `> After: \`${newMember.nickname || "None"}\``
                );
            }

            const addedRoles = newMember.roles.cache.filter(
                role => !oldMember.roles.cache.has(role.id)
            );
            const removedRoles = oldMember.roles.cache.filter(
                role => !newMember.roles.cache.has(role.id)
            );

            if (addedRoles.size > 0) {
                changes.push(
                    `> **Roles Added**`,
                    `> ${addedRoles.map(r => r.toString()).join(", ")}`
                );
                requiresAuditLog = true;
            }

            if (removedRoles.size > 0) {
                changes.push(
                    `> **Roles Removed**`,
                    `> ${removedRoles.map(r => r.toString()).join(", ")}`
                );
                requiresAuditLog = true;
            }

            if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) {
                const oldTimeout = oldMember.communicationDisabledUntil
                    ? `<t:${Math.floor(oldMember.communicationDisabledUntilTimestamp! / 1000)}:F>`
                    : "None";
                const newTimeout = newMember.communicationDisabledUntil
                    ? `<t:${Math.floor(newMember.communicationDisabledUntilTimestamp! / 1000)}:F>`
                    : "None";

                changes.push(
                    `> **Timeout**`,
                    `> Before: ${oldTimeout}`,
                    `> After: ${newTimeout}`
                );
                requiresAuditLog = true;
            }

            if (oldMember.avatar !== newMember.avatar) {
                changes.push(
                    `> **Server Avatar**`,
                    `> Before: ${oldMember.avatarURL() ? `[View Avatar](${oldMember.avatarURL()})` : "\`None\`"}`,
                    `> After: ${newMember.avatarURL() ? `[View Avatar](${newMember.avatarURL()})` : "\`None\`"}`
                );
            }

            if (oldMember.pending !== newMember.pending) {
                changes.push(
                    `> **Membership Screening**`,
                    `> Before: \`${oldMember.pending ? "Pending" : "Completed"}\``,
                    `> After: \`${newMember.pending ? "Pending" : "Completed"}\``
                );
            }

            if (changes.length === 0) return;

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

            const message = [
                `### 👤 Member Updated`,
                ``,
                ...(executor ? [
                    `### Executor`,
                    `> <@${executor.id}>`,
                    `> **User ID:** \`${executor.id}\``,
                    `> **Username:** \`${executor.tag}\``,
                    ``
                ] : []),
                `### Member`,
                `> <@${newMember.id}>`,
                `> **User ID:** \`${newMember.id}\``,
                `> **Username:** \`${newMember.user.tag}\``,
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
                    member: {
                        id: newMember.id,
                        username: newMember.user.username,
                        tag: newMember.user.tag
                    },
                    changes: {
                        nickname: oldMember.nickname !== newMember.nickname,
                        roles: addedRoles.size > 0 || removedRoles.size > 0,
                        timeout: oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp,
                        avatar: oldMember.avatar !== newMember.avatar,
                        pending: oldMember.pending !== newMember.pending
                    },
                    details: {
                        oldNickname: oldMember.nickname,
                        newNickname: newMember.nickname,
                        addedRoles: addedRoles.map(r => ({id: r.id, name: r.name})),
                        removedRoles: removedRoles.map(r => ({id: r.id, name: r.name})),
                        oldTimeout: oldMember.communicationDisabledUntil?.toISOString(),
                        newTimeout: newMember.communicationDisabledUntil?.toISOString(),
                        oldPending: oldMember.pending,
                        newPending: newMember.pending
                    },
                    executor: executor ? {
                        id: executor.id,
                        username: executor.username,
                        tag: executor.tag
                    } : null,
                    updateTime: new Date().toISOString()
                }, null, 2),
                "MemberUpdate"
            );
        } catch (error) {
            console.error("Error processing member update:", error);
        }
    }
};