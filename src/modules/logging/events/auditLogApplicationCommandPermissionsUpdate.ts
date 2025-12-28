import {
    ApplicationCommandPermissionsUpdateData,
    ApplicationCommandPermissionType,
    AuditLogEvent,
    Client,
    Events,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.ApplicationCommandPermissionsUpdate,

    /**
     * @param {import("discord.js").ApplicationCommandPermissionsUpdateData} data
     * @param {Client} client
     */
    async execute(
        data: ApplicationCommandPermissionsUpdateData,
        client: ExtendedClient
    ) {
        const guildId = data.guildId;
        const guild = await client.guilds.fetch(guildId);

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

        if (!loggingData || !loggingData.Integration) return;

        const webhook = new WebhookClient({url: loggingData.Integration});

        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.ApplicationCommandPermissionUpdate
        });

        const logEntry = auditLogs.entries.first();
        const executor = logEntry?.executor;

        const permissionsText = data.permissions
            .map((permission) => {
                let type = "Unknown";
                let mention = permission.id;

                if (permission.type == ApplicationCommandPermissionType.User) {
                    type = "User";
                    mention = `<@${permission.id}>`;
                } else if (permission.type == ApplicationCommandPermissionType.Role) {
                    type = "Role";
                    mention = `<@&${permission.id}>`;
                } else if (permission.type == ApplicationCommandPermissionType.Channel) {
                    type = "Channel";
                    mention = `<#${permission.id}>`;
                }

                return `> **${type}:** ${mention} (\`${permission.id}\`) - **Allowed:** \`${permission.permission}\``;
            })
            .join("\n");

        const logMessage = [
            `### 🔧 Command Permissions Updated`,
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
            `### Details`,
            `> **Command ID:** \`${data.id || "Unknown"}\``,
            `> **Application ID:** \`${data.applicationId}\``,
            ``,
            `### Permissions`,
            permissionsText,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            logMessage,
            webhook,
            JSON.stringify(data, null, 2),
            "ApplicationCommandPermissionsUpdate"
        );
    }
};