import {
    AuditLogEvent,
    Client,
    Events,
    Guild,
    GuildAuditLogsEntry,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildAuditLogEntryCreate,

    async execute(
        auditLogEntry: GuildAuditLogsEntry,
        guild: Guild,
        client: ExtendedClient
    ) {
        // Only handle integration deletion events
        if (auditLogEntry.action !== AuditLogEvent.IntegrationDelete) return;
        if (!guild) return;

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
            const executor = auditLogEntry.executor;
            if (!executor) return;

            // Extract integration details from changes
            const integrationName = auditLogEntry.changes.find(change =>
                change.key === 'name'
            )?.old as string | undefined;

            const integrationType = auditLogEntry.changes.find(change =>
                change.key === 'type'
            )?.old as string | undefined;

            // Prepare the log message
            const messageContent = [
                `### Integration Deleted`,
                ``,
                `> **Executor**: ${executor} (\`${executor.id}\`)`,
                `> **Integration Name**: \`${integrationName || "Unknown"}\``,
                `> **Type**: \`${integrationType || "Unknown"}\``,
                ``,
                `- **Deleted at**: \`${new Date().toLocaleString()}\``
            ].join("\n");

            // Prepare the JSON data
            const jsonData = {
                integration: {
                    id: auditLogEntry.targetId,
                    name: integrationName,
                    type: integrationType,
                    deletedAt: new Date().toISOString()
                },
                executor: {
                    id: executor.id,
                    username: executor.username,
                    tag: executor.tag,
                    avatarURL: executor.displayAvatarURL()
                },
                guild: {
                    id: guild.id,
                    name: guild.name
                },
                deletionDetails: {
                    reason: auditLogEntry.reason || "Not specified"
                }
            };

            await loggingHelper(client,
                messageContent,
                webhook,
                JSON.stringify(jsonData, null, 2),
                "IntegrationDelete"
            );
        } catch (error) {
            console.error("Error processing integration deletion:", error);
        }
    }
};