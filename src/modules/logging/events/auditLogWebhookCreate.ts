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
        // Only process webhook creation events
        if (auditLog.action !== AuditLogEvent.WebhookCreate) return;
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
        const targetWebhook = auditLog.target as Webhook;
        const eventTime = new Date();

        await loggingHelper(client,
            [
                "### Webhook Created",
                "",
                `> **Executor:** ${executor ? `<@${executor.id}> (\`${executor.tag}\`)` : 'Unknown'}`,
                `> **Webhook Name:** \`${targetWebhook.name || "Unknown"}\``,
                `> **Channel:** <#${targetWebhook.channelId}>`,
                `> **Webhook ID:** \`${targetWebhook.id}\``,
                `> **Reason:** \`${auditLog.reason || "No reason provided"}\``,
                `> **Created At:** \`${eventTime.toLocaleString()}\``,
                "",
                `-# **Executor ID:** ${executor?.id || "Unknown"}`,
                `-# **Webhook Type:** ${targetWebhook.type}`
            ].join("\n"),
            webhookClient,
            JSON.stringify({
                executor: executor ? {
                    id: executor.id,
                    username: executor.username,
                    discriminator: executor.discriminator
                } : null,
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
                timestamp: eventTime.toISOString()
            }),
            "WebhookCreate"
        );
    }
};