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

function formatKeyName(key: string): string {
    return key
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default {
    name: Events.GuildAuditLogEntryCreate,

    async execute(
        auditLogEntry: GuildAuditLogsEntry,
        guild: Guild,
        client: ExtendedClient
    ) {
        if (auditLogEntry.action !== AuditLogEvent.IntegrationUpdate) return;
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

            const changes: string[] = [];
            const changesData: Array<{key: string, old: string, new: string}> = [];

            auditLogEntry.changes.forEach(change => {
                const oldValue = change.old?.toString() || "None";
                const newValue = change.new?.toString() || "None";

                changesData.push({
                    key: change.key,
                    old: oldValue,
                    new: newValue
                });

                changes.push(
                    `> **${formatKeyName(change.key)}**`,
                    `> Before: \`${oldValue}\``,
                    `> After: \`${newValue}\``
                );
            });

            const integrationName = auditLogEntry.changes.find(c => c.key === 'name')?.new as string ||
                auditLogEntry.target?.toString() ||
                "Unknown";

            if (changes.length === 0) return;

            const message = [
                `### 🔄 Integration Updated`,
                ``,
                `### Executor`,
                `> <@${executor.id}>`,
                `> **User ID:** \`${executor.id}\``,
                `> **Username:** \`${executor.tag}\``,
                ``,
                `### Integration Details`,
                `> **Name:** \`${integrationName}\``,
                `> **Integration ID:** \`${auditLogEntry.targetId || "Unknown"}\``,
                ``,
                `### Changes`,
                ...changes,
                ``,
                ...(auditLogEntry.reason ? [
                    `### Reason`,
                    `> ${auditLogEntry.reason}`,
                    ``
                ] : []),
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
                        changes: changesData,
                        updatedAt: new Date().toISOString()
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
                    updateDetails: {
                        reason: auditLogEntry.reason || null
                    }
                }, null, 2),
                "IntegrationUpdate"
            );
        } catch (error) {
            console.error("Error processing integration update:", error);
        }
    }
};