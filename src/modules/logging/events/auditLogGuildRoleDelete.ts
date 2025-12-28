import {
    AuditLogEvent,
    Events,
    PermissionsBitField,
    Role,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

function formatPermissionName(permission: string): string {
    return permission
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export default {
    name: Events.GuildRoleUpdate,

    async execute(oldRole: Role, newRole: Role, client: ExtendedClient) {
        const guild = newRole.guild;
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
            type: AuditLogEvent.RoleUpdate,
            limit: 1
        }).catch(() => null);

        const updater = auditLogs?.entries.first()?.executor;

        const changes: string[] = [];

        if (oldRole.name !== newRole.name) {
            changes.push(
                `> **Name**`,
                `> Before: \`${oldRole.name}\``,
                `> After: \`${newRole.name}\``
            );
        }

        if (oldRole.color !== newRole.color) {
            changes.push(
                `> **Color**`,
                `> Before: \`${oldRole.hexColor}\``,
                `> After: \`${newRole.hexColor}\``
            );
        }

        if (oldRole.position !== newRole.position) {
            changes.push(
                `> **Position**`,
                `> Before: \`${oldRole.position}\``,
                `> After: \`${newRole.position}\``
            );
        }

        if (oldRole.hoist !== newRole.hoist) {
            changes.push(
                `> **Hoisted**`,
                `> Before: \`${oldRole.hoist ? "Yes" : "No"}\``,
                `> After: \`${newRole.hoist ? "Yes" : "No"}\``
            );
        }

        if (oldRole.mentionable !== newRole.mentionable) {
            changes.push(
                `> **Mentionable**`,
                `> Before: \`${oldRole.mentionable ? "Yes" : "No"}\``,
                `> After: \`${newRole.mentionable ? "Yes" : "No"}\``
            );
        }

        if (oldRole.icon !== newRole.icon) {
            changes.push(
                `> **Icon**`,
                `> Before: ${oldRole.iconURL() ? `[View Icon](${oldRole.iconURL()})` : "\`None\`"}`,
                `> After: ${newRole.iconURL() ? `[View Icon](${newRole.iconURL()})` : "\`None\`"}`
            );
        }

        if (oldRole.unicodeEmoji !== newRole.unicodeEmoji) {
            changes.push(
                `> **Unicode Emoji**`,
                `> Before: \`${oldRole.unicodeEmoji || "None"}\``,
                `> After: \`${newRole.unicodeEmoji || "None"}\``
            );
        }

        if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
            const oldPerms = new PermissionsBitField(oldRole.permissions.bitfield);
            const newPerms = new PermissionsBitField(newRole.permissions.bitfield);

            const added = newPerms.toArray().filter(p => !oldPerms.has(p));
            const removed = oldPerms.toArray().filter(p => !newPerms.has(p));

            if (added.length > 0) {
                const formattedAdded = added.map(p => formatPermissionName(p)).join(", ");
                changes.push(
                    `> **Permissions Added**`,
                    `> ${formattedAdded}`
                );
            }
            if (removed.length > 0) {
                const formattedRemoved = removed.map(p => formatPermissionName(p)).join(", ");
                changes.push(
                    `> **Permissions Removed**`,
                    `> ${formattedRemoved}`
                );
            }
        }

        if (changes.length === 0) return;

        const message = [
            `### 🔄 Role Updated`,
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
            `### Role Details`,
            `> **Name:** ${newRole} (\`${newRole.name}\`)`,
            `> **Role ID:** \`${newRole.id}\``,
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
                oldRole: {
                    id: oldRole.id,
                    name: oldRole.name,
                    color: oldRole.color,
                    hexColor: oldRole.hexColor,
                    position: oldRole.position,
                    hoist: oldRole.hoist,
                    mentionable: oldRole.mentionable,
                    icon: oldRole.icon,
                    unicodeEmoji: oldRole.unicodeEmoji,
                    permissions: oldRole.permissions.toArray().map(p => formatPermissionName(p)),
                    createdAt: oldRole.createdAt.toISOString()
                },
                newRole: {
                    id: newRole.id,
                    name: newRole.name,
                    color: newRole.color,
                    hexColor: newRole.hexColor,
                    position: newRole.position,
                    hoist: newRole.hoist,
                    mentionable: newRole.mentionable,
                    icon: newRole.icon,
                    unicodeEmoji: newRole.unicodeEmoji,
                    permissions: newRole.permissions.toArray().map(p => formatPermissionName(p)),
                    createdAt: newRole.createdAt.toISOString()
                },
                updater: updater ? {
                    id: updater.id,
                    username: updater.username,
                    tag: updater.tag
                } : null,
                updateTime: new Date().toISOString()
            }, null, 2),
            "RoleUpdate"
        );
    }
};