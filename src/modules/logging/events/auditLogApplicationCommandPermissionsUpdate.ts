import {
    ApplicationCommandPermissionsUpdateData,
    ApplicationCommandPermissionType,
    AuditLogChange,
    AuditLogEvent,
    Client,
    EmbedBuilder,
    Events,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

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
        const loggingData = await database.guildLoggings.findFirst({
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
                if (permission.type == ApplicationCommandPermissionType.User) {
                    return `> **- User** <@${permission.id}> (\`${permission.id}\`) - **Allowed**: \`${permission.permission}\``;
                }

                if (permission.type == ApplicationCommandPermissionType.Role) {
                    return `> **- Role** <@&${permission.id}> (\`${permission.id}\`) - **Allowed**: \`${permission.permission}\``;
                }

                if (permission.type == ApplicationCommandPermissionType.Channel) {
                    return `> **- Channel** <#${permission.id}> (\`${permission.id}\`) - **Allowed**: \`${permission.permission}\``;
                }

                return `> **- Unknown Type** ${permission.id} - **Allowed**: \`${permission.permission}\``;
            })
            .join("\n");

        await loggingHelper(client,
            [
                `### Application Command Permissions Updated`,
                ``,
                `> **Command Id:** \`${data.id ? data.id : "Unknown Command"}\``,
                `> **Permissions:**`,
                `${permissionsText}`,
                ``,
                `-# **Executor: @${executor?.tag}**`
            ].join("\n"),
            webhook,
            JSON.stringify(data),
            "ApplicationCommandPermissionsUpdate"
        )
    }
};
