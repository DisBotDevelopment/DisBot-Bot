import {
    AuditLogEvent,
    Events,
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
    name: Events.GuildRoleCreate,

    async execute(role: Role, client: ExtendedClient) {
        const guild = role.guild;
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
            type: AuditLogEvent.RoleCreate,
            limit: 1
        }).catch(() => null);

        const creator = auditLogs?.entries.first()?.executor;

        const permissions = role.permissions.toArray();
        const formattedPermissions = permissions.length > 0
            ? permissions.map(p => formatPermissionName(p)).join(", ")
            : "None";

        const message = [
            `### ➕ Role Created`,
            ``,
            `### Executor`,
            ...(creator ? [
                `> <@${creator.id}>`,
                `> **User ID:** \`${creator.id}\``,
                `> **Username:** \`${creator.tag}\``
            ] : [
                `> *Unknown Executor*`
            ]),
            ``,
            `### Role Details`,
            `> **Name:** ${role} (\`${role.name}\`)`,
            `> **Role ID:** \`${role.id}\``,
            `> **Color:** \`${role.hexColor}\``,
            `> **Position:** \`${role.position}\``,
            `> **Mentionable:** \`${role.mentionable ? "Yes" : "No"}\``,
            `> **Hoisted:** \`${role.hoist ? "Yes" : "No"}\``,
            `> **Managed:** \`${role.managed ? "Yes" : "No"}\``,
            ``,
            `### Permissions`,
            `> ${formattedPermissions}`,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
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
                    managed: role.managed,
                    permissions: permissions.map(p => formatPermissionName(p)),
                    createdAt: role.createdAt.toISOString(),
                    rawPosition: role.rawPosition
                },
                creator: creator ? {
                    id: creator.id,
                    username: creator.username,
                    tag: creator.tag
                } : null,
                creationTime: new Date().toISOString()
            }, null, 2),
            "RoleCreate"
        );
    }
};