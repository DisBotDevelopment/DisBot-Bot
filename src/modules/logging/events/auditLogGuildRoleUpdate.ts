import {
    AuditLogEvent,
    Events,
    PermissionsBitField,
    Role,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildRoleUpdate,

    async execute(oldRole: Role, newRole: Role, client: ExtendedClient) {
        const guild = newRole.guild;
        if (!guild) {
            console.error("Guild not found for role:", newRole.id);
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

        // Get role updater from audit logs
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.RoleUpdate,
            limit: 1
        }).catch(() => null);

        const updater = auditLogs?.entries.first()?.executor;

        // Track all changes between old and new role
        const changes: string[] = [];

        // Helper function to format permission names
        const formatPermission = (permission: string) => {
            return permission
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
        };

        // Check basic role properties
        if (oldRole.name !== newRole.name) {
            changes.push(`> **Name**: \`${oldRole.name}\` → \`${newRole.name}\``);
        }

        if (oldRole.color !== newRole.color) {
            changes.push(`> **Color**: \`${oldRole.hexColor}\` → \`${newRole.hexColor}\``);
        }

        if (oldRole.position !== newRole.position) {
            changes.push(`> **Position**: \`${oldRole.position}\` → \`${newRole.position}\``);
        }

        if (oldRole.hoist !== newRole.hoist) {
            changes.push(`> **Display Separately**: \`${oldRole.hoist ? "Yes" : "No"}\` → \`${newRole.hoist ? "Yes" : "No"}\``);
        }

        if (oldRole.mentionable !== newRole.mentionable) {
            changes.push(`> **Mentionable**: \`${oldRole.mentionable ? "Yes" : "No"}\` → \`${newRole.mentionable ? "Yes" : "No"}\``);
        }

        // Check permission changes with detailed tracking
        if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
            const oldPerms = new PermissionsBitField(oldRole.permissions);
            const newPerms = new PermissionsBitField(newRole.permissions);

            const added = newPerms.toArray().filter(p => !oldPerms.has(p));
            const removed = oldPerms.toArray().filter(p => !newPerms.has(p));

            if (added.length > 0) {
                changes.push(
                    `> **Permissions Added**:\n\`\`\`diff\n+ ${added.map(formatPermission).join("\n+ ")}\n\`\`\``
                );
            }
            if (removed.length > 0) {
                changes.push(
                    `> **Permissions Removed**:\n\`\`\`diff\n- ${removed.map(formatPermission).join("\n- ")}\n\`\`\``
                );
            }
        }

        // If no changes detected, don't log
        if (changes.length === 0) return;

        // Prepare the log message
        const messageContent = [
            `### Role Updated: ${newRole.name} (${newRole.id})`,
            ``,
            ...changes,
            ``,
            `- **Updated by**: ${updater ? `@${updater.tag}` : "Unknown"}`,
            `- **Updated at**: \`${new Date().toLocaleString()}\``
        ].join("\n");

        // Prepare the JSON data
        const jsonData = {
            oldRole: {
                id: oldRole.id,
                name: oldRole.name,
                color: oldRole.color,
                hexColor: oldRole.hexColor,
                position: oldRole.position,
                hoist: oldRole.hoist,
                mentionable: oldRole.mentionable,
                permissions: oldRole.permissions.toArray(),
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
                permissions: newRole.permissions.toArray(),
                createdAt: newRole.createdAt.toISOString()
            },
            changes: {
                name: oldRole.name !== newRole.name,
                color: oldRole.color !== newRole.color,
                position: oldRole.position !== newRole.position,
                hoist: oldRole.hoist !== newRole.hoist,
                mentionable: oldRole.mentionable !== newRole.mentionable,
                permissions: oldRole.permissions.bitfield !== newRole.permissions.bitfield
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
            "RoleUpdate"
        );
    }
};