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
        // Nur Webhook-Updates loggen
        if (auditLog.action !== AuditLogEvent.WebhookUpdate) return;
        if (!guild || !auditLog.target || !auditLog.changes) return;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: { GuildId: guild.id, LoggingEnabled: true }
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
        const updatedWebhook = auditLog.target as Webhook;
        const updateTime = new Date();

        const emoji = "✏️";
        const action = "Webhook Updated";
        const detailsLines: string[] = [];

        // Changes
        for (const change of auditLog.changes) {
            switch (change.key) {
                case "name":
                    detailsLines.push(`> **Name Changed:** \`${change.old}\` → \`${change.new}\``);
                    break;
                case "channel_id":
                    detailsLines.push(`> **Channel Changed:** <#${change.old}> → <#${change.new}>`);
                    break;
                default:
                    detailsLines.push(`> **${change.key} Changed:** \`${change.old}\` → \`${change.new}\``);
            }
        }

        detailsLines.push(`> **Webhook ID:** \`${updatedWebhook.id}\``);
        detailsLines.push(`> **Type:** \`${updatedWebhook.type}\``);
        detailsLines.push(`> **Reason:** \`${auditLog.reason || "No reason provided"}\``);

        const message = [
            `### ${emoji} ${action}`,
            ``,
            `### Executor`,
            `> ${executor ? `<@${executor.id}> (\`${executor.tag}\`)` : "System"}`,
            `> **Executor ID:** \`${executor?.id || "System"}\``,
            ``,
            `### Details`,
            ...detailsLines,
            ``,
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
                    id: updatedWebhook.id,
                    name: updatedWebhook.name,
                    channelId: updatedWebhook.channelId,
                    type: updatedWebhook.type,
                    guildId: updatedWebhook.guildId
                },
                auditLog: {
                    action: auditLog.action,
                    reason: auditLog.reason,
                    changes: auditLog.changes
                },
                timestamp: updateTime.toISOString()
            }, null, 2),
            "WebhookUpdate"
        );
    }
};
