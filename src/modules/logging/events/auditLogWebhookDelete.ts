import {
    AuditLogEvent,
    Events,
    Guild,
    GuildAuditLogsEntry,
    Webhook,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

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
        // Only process webhook deletion events
        if (auditLog.action !== AuditLogEvent.WebhookDelete) return;
        if (!guild || !auditLog.target) return;

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

        if (!loggingData?.Webhook) return;

        const webhookClient = new WebhookClient({url: loggingData.Webhook});
        const executor = auditLog.executor ? await client.users.fetch(auditLog.executor.id).catch(() => null) : null;
        const deletedWebhook = auditLog.target as Webhook;
        const deletionTime = new Date();

        await loggingHelper(client,
            [
                "### Webhook Deleted",
                "",
                `> **Executor:** ${executor ? `<@${executor.id}> (\`${executor.tag}\`)` : 'System'}`,
                `> **Webhook Name:** \`${deletedWebhook.name || "Unknown"}\``,
                `> **Channel:** <#${deletedWebhook.channelId}>`,
                `> **Webhook ID:** \`${deletedWebhook.id}\``,
                `> **Type:** \`${deletedWebhook.type}\``,
                `> **Reason:** \`${auditLog.reason || "No reason provided"}\``,
                `> **Deleted At:** \`${deletionTime.toLocaleString()}\``,
                "",
                `-# **Executor ID:** ${executor?.id || "System"}`,
                `-# **Webhook Created At:** ${deletedWebhook.createdAt ? deletedWebhook.createdAt.toLocaleString() : "Unknown"}`
            ].join("\n"),
            webhookClient,
            JSON.stringify({
                executor: executor ? {
                    id: executor.id,
                    username: executor.username,
                    discriminator: executor.discriminator
                } : null,
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
            }),
            "WebhookDelete"
        );
    }
};