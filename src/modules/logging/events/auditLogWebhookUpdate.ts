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
        // Only process webhook update events
        if (auditLog.action !== AuditLogEvent.WebhookUpdate) return;
        if (!guild || !auditLog.target || !auditLog.changes) return;

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
        const updatedWebhook = auditLog.target as Webhook;
        const updateTime = new Date();

        // Process changes
        const changes = auditLog.changes.map(change => {
            switch (change.key) {
                case 'name':
                    return `> **Name Changed:** \`${change.old}\` → \`${change.new}\``;
                case 'channel_id':
                    return `> **Channel Changed:** <#${change.old}> → <#${change.new}>`;
                default:
                    return `> **${change.key} Changed:** \`${change.old}\` → \`${change.new}\``;
            }
        });

        await loggingHelper(client,
            [
                "### Webhook Updated",
                "",
                `> **Executor:** ${executor ? `<@${executor.id}> (\`${executor.tag}\`)` : 'System'}`,
                `> **Webhook ID:** \`${updatedWebhook.id}\``,
                ...changes,
                `> **Reason:** \`${auditLog.reason || "No reason provided"}\``,
                `> **Updated At:** \`${updateTime.toLocaleString()}\``,
                "",
                `-# **Executor ID:** ${executor?.id || "System"}`,
                `-# **Webhook Type:** ${updatedWebhook.type}`
            ].join("\n"),
            webhookClient,
            JSON.stringify({
                executor: executor ? {
                    id: executor.id,
                    username: executor.username,
                    discriminator: executor.discriminator
                } : null,
                webhook: {
                    id: updatedWebhook.id,
                    name: updatedWebhook.name,
                    channelId: updatedWebhook.channelId,
                    type: updatedWebhook.type,
                    guildId: updatedWebhook.guildId
                },
                changes: auditLog.changes,
                auditLog: {
                    action: auditLog.action,
                    reason: auditLog.reason
                },
                timestamp: updateTime.toISOString()
            }),
            "WebhookUpdate"
        );
    }
};