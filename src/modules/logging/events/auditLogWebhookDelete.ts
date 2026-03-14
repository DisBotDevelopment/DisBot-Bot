import {
    AuditLogEvent,
    Events,
    Guild,
    GuildAuditLogsEntry,
    Webhook,
    WebhookClient
} from "discord.js";
import { ExtendedClient } from "../../../types/ExtendedClient.js";
import { loggingHelper } from "../../../helper/loggingHelper.js";
import { database } from "../../../main/database.js";

export default {
    name: Events.GuildAuditLogEntryCreate,

    /**
     * @param {GuildAuditLogsEntry} auditLog
     * @param {Guild} guild
     * @param {ExtendedClient} client
     */
    async execute(
        auditLog: GuildAuditLogsEntry,
        guild: Guild,
        client: ExtendedClient
    ) {
        // Nur Webhook-Löschungen loggen
        if (auditLog.action !== AuditLogEvent.WebhookDelete) return;
        if (!guild || !auditLog.target) return;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guild.id,
                LoggingEnabled: true
            }
        });
        if (!enabled?.LoggingEnabled) return;

        const loggingData = await database.guildLogging.findFirst({
            where: { GuildId: guild.id }
        });
        if (!loggingData?.Webhook) return;

        const webhookClient = new WebhookClient({ url: loggingData.Webhook });
        const executor = auditLog.executor
            ? await client.users.fetch(auditLog.executor.id).catch(() => null)
            : null;
        const deletedWebhook = auditLog.target as Webhook;
        const deletionTime = new Date();

        const emoji = "🗑️";
        const action = "Webhook Deleted";
        const detailsLines: string[] = [];

        detailsLines.push(`> **Webhook Name:** \`${deletedWebhook.name || "Unknown"}\``);
        detailsLines.push(`> **Channel:** <#${deletedWebhook.channelId}>`);
        detailsLines.push(`> **Webhook ID:** \`${deletedWebhook.id}\``);
        detailsLines.push(`> **Type:** \`${deletedWebhook.type}\``);
        detailsLines.push(`> **Reason:** \`${auditLog.reason || "No reason provided"}\``);

        const message = [
            `### ${emoji} ${action}`,
            ``,
            `### Executor`,
            `> ${executor ? `<@${executor.id}> (\`${executor.tag}\`)` : 'System'}`,
            `> **Executor ID:** \`${executor?.id || "System"}\``,
            ``,
            ...(detailsLines.length > 0 ? [
                `### Details`,
                ...detailsLines,
                ``
            ] : []),
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhookClient,
            JSON.stringify({
                executor: executor
                    ? { id: executor.id, username: executor.username, tag: executor.tag }
                    : null,
                webhook: {
                    id: deletedWebhook.id,
                    name: deletedWebhook.name,
                    channelId: deletedWebhook.channelId,
                    type: deletedWebhook.type,
                    guildId: deletedWebhook.guildId,
                    createdAt: deletedWebhook.createdAt?.toISOString()
                },
                auditLog: {
                    action: auditLog.action,
                    reason: auditLog.reason,
                    changes: auditLog.changes
                },
                timestamp: deletionTime.toISOString()
            }, null, 2),
            "WebhookDelete"
        );
    }
};
