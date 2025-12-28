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
        // Nur Webhook-Erstellungen loggen
        if (auditLog.action !== AuditLogEvent.WebhookCreate) return;
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
        const targetWebhook = auditLog.target as Webhook;

        let emoji = "🔗";
        let action = "Webhook Created";
        let detailsLines: string[] = [];

        detailsLines.push(`> **Webhook Name:** \`${targetWebhook.name || "Unknown"}\``);
        detailsLines.push(`> **Channel:** <#${targetWebhook.channelId}>`);
        detailsLines.push(`> **Webhook ID:** \`${targetWebhook.id}\``);
        detailsLines.push(`> **Reason:** \`${auditLog.reason || "No reason provided"}\``);

        const message = [
            `### ${emoji} ${action}`,
            ``,
            `### Executor`,
            `> ${executor ? `<@${executor.id}> (\`${executor.tag}\`)` : 'Unknown'}`,
            `> **Executor ID:** \`${executor?.id || "Unknown"}\``,
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
                    id: targetWebhook.id,
                    name: targetWebhook.name,
                    channelId: targetWebhook.channelId,
                    type: targetWebhook.type,
                    guildId: targetWebhook.guildId
                },
                auditLog: {
                    action: auditLog.action,
                    reason: auditLog.reason,
                    changes: auditLog.changes
                },
                timestamp: new Date().toISOString()
            }, null, 2),
            "WebhookCreate"
        );
    }
};
