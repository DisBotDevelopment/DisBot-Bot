import {
    AuditLogEvent,
    EmbedBuilder,
    Events,
    Guild,
    GuildAuditLogsEntry,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js"; // Prisma client
import {loggingHelper} from "../../../helper/loggingHelper.js";

export default {
    name: Events.GuildAuditLogEntryCreate,

    /**
     * @param {GuildAuditLogsEntry} auditLog
     * @param {Guild} guild
     * @param {ExtendedClient} client
     */
    async execute(auditLog: GuildAuditLogsEntry, guild: Guild, client: ExtendedClient) {
        // Bot Add Event
        if (auditLog.action === AuditLogEvent.BotAdd) {
            if (!guild) return;

            const enabled = await database.guildFeatureToggles.findFirst({
                where: {
                    GuildId: guild.id,
                    LoggingEnabled: true,
                },
            });
            const loggingData = await database.guildLoggings.findFirst({
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

            await loggingHelper(client,
                `### Bot Add\n> **Username**: @${botUser.username} (<@${botUser.id}>)\n**Executor**: @${executor.tag}`,
                webhook,
                JSON.stringify(auditLog),
                "GuildAuditLogEntryCreate_BotAdd"
            );
        }
    },
};
