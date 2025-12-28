import {
    AuditLogEvent,
    Events,
    Guild,
    GuildAuditLogsEntry,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildAuditLogEntryCreate,

    async execute(
        auditLogEntry: GuildAuditLogsEntry,
        guild: Guild,
        client: ExtendedClient
    ) {
        if (auditLogEntry.action !== AuditLogEvent.IntegrationDelete) return;
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

        try {
            const executor = auditLogEntry.executor;
            if (!executor) return;

            const integrationName = auditLogEntry.changes.find(change =>
                change.key === 'name'
            )?.old as string | undefined;

            const integrationType = auditLogEntry.changes.find(change =>
                change.key === 'type'
            )?.old as string | undefined;

            const message = [
                `### 🗑️ Integration Deleted`,
                ``,
                `### Executor`,
                `> <@${executor.id}>`,
                `> **User ID:** \`${executor.id}\``,
                `> **Username:** \`${executor.tag}\``,
                ``,
                `### Deleted Integration`,
                `> **Name:** \`${integrationName || "Unknown"}\``,
                `> **Type:** \`${integrationType || "Unknown"}\``,
                `> **Integration ID:** \`${auditLogEntry.targetId || "Unknown"}\``,
                ...(auditLogEntry.reason ? [
                    ``,
                    `### Reason`,
                    `> ${auditLogEntry.reason}`
                ] : []),
                ``,
                `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
            ].join("\n");

            await loggingHelper(
                client,
                message,
                webhook,
                JSON.stringify({
                    integration: {
                        id: auditLogEntry.targetId,
                        name: integrationName,
                        type: integrationType,
                        deletedAt: new Date().toISOString()
                    },
                    executor: {
                        id: executor.id,
                        username: executor.username,
                        tag: executor.tag
                    },
                    guild: {
                        id: guild.id,
                        name: guild.name
                    },
                    deletionDetails: {
                        reason: auditLogEntry.reason || null
                    }
                }, null, 2),
                "IntegrationDelete"
            );
        } catch (error) {
            console.error("Error processing integration deletion:", error);
        }
    }
};