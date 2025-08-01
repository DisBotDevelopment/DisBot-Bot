import {
    AuditLogEvent,
    Events,
    Guild,
    GuildAuditLogsEntry,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";

export default {
    name: Events.GuildAuditLogEntryCreate,

    /**
     * @param {GuildAuditLogsEntry} auditLogEntry
     * @param {Guild} guild
     * @param {ExtendedClient} client
     */
    async execute(
        auditLogEntry: GuildAuditLogsEntry,
        guild: Guild,
        client: ExtendedClient
    ): Promise<void> {
        if (auditLogEntry.action !== AuditLogEvent.MessageUnpin) return;

        const executor = auditLogEntry.executor;
        if (!executor) return;

        const extra = auditLogEntry.extra;
        if (
            !extra ||
            typeof extra !== "object" ||
            !("channel" in extra) ||
            !("messageId" in extra)
        ) return;

        const channelId = extra.channel?.id;
        const messageId = extra.messageId;
        if (!channelId || !messageId) return;

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

        if (!loggingData?.Message) return;

        const webhook = new WebhookClient({url: loggingData.Message});

        const jumpLink = `https://discord.com/channels/${guild.id}/${channelId}/${messageId}`;

        const logMessage = [
            `### Message Unpinned`,
            ``,
            `> **Member:** <@${executor.id}> (\`${executor.id}\`)`,
            `> **Channel:** <#${channelId}> (\`${channelId}\`)`,
            `> **Message:** [\`Jump to message\`](${jumpLink})`
        ].join("\n");

        await loggingHelper(client,
            logMessage,
            webhook,
            JSON.stringify({
                action: "MessageUnpin",
                guildId: guild.id,
                executor: {
                    id: executor.id,
                    tag: executor.tag
                },
                channelId,
                messageId
            }, null, 2),
            "GuildAuditLogEntryCreate"
        );
    }
};
