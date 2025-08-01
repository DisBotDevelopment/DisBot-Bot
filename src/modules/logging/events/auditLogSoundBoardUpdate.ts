import {
    ApplicationCommandPermissionsUpdateData,
    ApplicationCommandPermissionType,
    AuditLogEvent,
    Events,
    WebhookClient,
    Client
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.ApplicationCommandPermissionsUpdate,

    /**
     * @param {ApplicationCommandPermissionsUpdateData} data
     * @param {ExtendedClient} client
     */
    async execute(data: ApplicationCommandPermissionsUpdateData, client: ExtendedClient) {
        const guildId = data.guildId;
        if (!guildId) return;

        const guild = await client.guilds.fetch(guildId).catch(() => null);
        if (!guild) return;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {GuildId: guildId, LoggingEnabled: true}
        });
        if (!enabled) return;

        const loggingData = await database.guildLoggings.findFirst({
            where: {GuildId: guildId}
        });
        if (!loggingData || !loggingData.Integration) return;

        const webhook = new WebhookClient({url: loggingData.Integration});

        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.ApplicationCommandPermissionUpdate,
            limit: 1
        });
        const logEntry = auditLogs.entries.first();
        const executor = logEntry?.executor;

        const permissionsText = data.permissions
            .map(permission => {
                switch (permission.type) {
                    case ApplicationCommandPermissionType.User:
                        return `> **- User** <@${permission.id}> (\`${permission.id}\`) - **Allowed**: \`${permission.permission}\``;
                    case ApplicationCommandPermissionType.Role:
                        return `> **- Role** <@&${permission.id}> (\`${permission.id}\`) - **Allowed**: \`${permission.permission}\``;
                    case ApplicationCommandPermissionType.Channel:
                        return `> **- Channel** <#${permission.id}> (\`${permission.id}\`) - **Allowed**: \`${permission.permission}\``;
                    default:
                        return `> **- Unknown Type** ${permission.id} - **Allowed**: \`${permission.permission}\``;
                }
            })
            .join("\n");

        const message = [
            "### Application Command Permissions Updated",
            "",
            `> **Command Id:** \`${data.id ?? "Unknown Command"}\``,
            `> **Guild:** \`${guild.name} (${guildId})\``,
            "",
            "**Permissions:**",
            permissionsText,
            "",
            `**Executor:** ${executor ? `${executor.tag} (\`${executor.id}\`)` : "Unknown"}`
        ].join("\n");

        await loggingHelper(client,message, webhook, JSON.stringify(data), "ApplicationCommandPermissionsUpdate");
    }
};
