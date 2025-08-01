import {
    AuditLogEvent,
    Events,
    Role,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildRoleCreate,

    async execute(role: Role, client: ExtendedClient) {
        const guild = role.guild;
        if (!guild) {
            console.error("Guild not found for role:", role.id);
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

        // Get role creator from audit logs
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.RoleCreate,
            limit: 1
        }).catch(() => null);

        const creator = auditLogs?.entries.first()?.executor;

        // Format role details
        const roleDetails = [
            `### New Role Created`,
            ``,
            `> **Name**: ${role} (\`${role.id}\`)`,
            `> **Color**: \`${role.hexColor}\``,
            `> **Position**: \`${role.position}\``,
            `> **Mentionable**: \`${role.mentionable ? "Yes" : "No"}\``,
            `> **Hoisted**: \`${role.hoist ? "Yes" : "No"}\``,
            `> **Permissions**: \`${role.permissions.toArray().join(", ") || "None"}\``,
            ``,
            `- **Created by**: ${creator ? `@${creator.tag}` : "Unknown"}`,
            `- **Created at**: \`${new Date().toLocaleString()}\``
        ];

        await loggingHelper(client,
            roleDetails.join("\n"),
            webhook,
            JSON.stringify({
                role: {
                    id: role.id,
                    name: role.name,
                    color: role.color,
                    hexColor: role.hexColor,
                    position: role.position,
                    mentionable: role.mentionable,
                    hoist: role.hoist,
                    permissions: role.permissions.toArray(),
                    createdAt: role.createdAt.toISOString(),
                    rawPosition: role.rawPosition
                },
                creator: creator ? {
                    id: creator.id,
                    username: creator.username,
                    tag: creator.tag,
                    avatarURL: creator.displayAvatarURL()
                } : null,
                creationTime: new Date().toISOString()
            }, null, 2),
            "RoleCreate"
        );
    }
};