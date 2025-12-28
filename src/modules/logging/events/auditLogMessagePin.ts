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
     * @param {GuildAuditLogsEntry} auditLogEntry
     * @param {Guild} guild
     * @param {ExtendedClient} client
     */
    async execute(
        auditLogEntry: GuildAuditLogsEntry,
        guild: Guild,
        client: ExtendedClient
    ): Promise<void> {
        try {
            if (auditLogEntry.action !== AuditLogEvent.MessagePin) return;

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

            if (!loggingData?.Message) return;

            const webhook = new WebhookClient({url: loggingData.Message});

            const executor = auditLogEntry.executor;
            const extra = auditLogEntry.extra;

            if (!executor || typeof extra !== "object" || !("channel" in extra) || !("messageId" in extra)) {
                console.error("Missing required data in audit log entry.");
                return;
            }

            const channelId = extra.channel?.id;
            const messageId = extra.messageId;

            if (!channelId || !messageId) {
                console.error("Channel ID or Message ID is missing.");
                return;
            }

            const jumpLink = `https://discord.com/channels/${guild.id}/${channelId}/${messageId}`;

            const message = [
                `### 📌 Message Pinned`,
                ``,
                `### Executor`,
                `> <@${executor.id}>`,
                `> **User ID:** \`${executor.id}\``,
                `> **Username:** \`${executor.tag}\``,
                ``,
                `### Details`,
                `> **Channel:** <#${channelId}> (\`${channelId}\`)`,
                `> **Message ID:** \`${messageId}\``,
                `> **Jump Link:** [Click here to view message](${jumpLink})`,
                ``,
                `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
            ].join("\n");

            await loggingHelper(
                client,
                message,
                webhook,
                JSON.stringify({
                    action: "MessagePin",
                    guildId: guild.id,
                    executor: {
                        id: executor.id,
                        tag: executor.tag
                    },
                    channelId,
                    messageId,
                    jumpLink
                }, null, 2),
                "MessagePin"
            );

        } catch (err) {
            console.error("Error in MessagePin logging:", err);
        }
    }
};