import {
    AuditLogEvent,
    Events,
    Guild,
    GuildAuditLogsEntry,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";

export default {
    name: Events.GuildAuditLogEntryCreate,

    /**
     * @param {GuildAuditLogsEntry} auditLog
     * @param {Guild} guild
     * @param {ExtendedClient} client
     */
    async execute(auditLog: GuildAuditLogsEntry, guild: Guild, client: ExtendedClient) {
        if (auditLog.action === AuditLogEvent.BotAdd) {
            if (!guild) return;

            const enabled = await database.guildFeatureToggles.findFirst({
                where: {
                    GuildId: guild.id,
                    LoggingEnabled: true,
                },
            });
            const loggingData = await database.guildLogging.findFirst({
                where: {
                    GuildId: guild.id,
                },
            });

            if (!enabled || !enabled.LoggingEnabled) return;
            if (!loggingData || !loggingData.Integration) return;

            const webhook = new WebhookClient({url: loggingData.Integration});

            const logs = await guild.fetchAuditLogs({
                type: AuditLogEvent.BotAdd,
                limit: 1,
            });

            const logEntry = logs.entries.first();
            if (!logEntry || logEntry.action !== AuditLogEvent.BotAdd) return;

            const executor = await client.users.fetch(logEntry.executorId ?? "");
            const botUser = await client.users.fetch(logEntry.targetId ?? "");

            const message = [
                `### 🤖 Bot Added`,
                ``,
                `### Executor`,
                `> <@${executor.id}>`,
                `> **User ID:** \`${executor.id}\``,
                `> **Username:** \`${executor.tag}\``,
                ``,
                `### Bot Details`,
                `> **Bot:** <@${botUser.id}>`,
                `> **Bot ID:** \`${botUser.id}\``,
                `> **Bot Username:** \`${botUser.tag}\``,
                ``,
                `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
            ].join("\n");

            await loggingHelper(
                client,
                message,
                webhook,
                JSON.stringify(auditLog, null, 2),
                "GuildAuditLogEntryCreate_BotAdd"
            );
        }
    },
};