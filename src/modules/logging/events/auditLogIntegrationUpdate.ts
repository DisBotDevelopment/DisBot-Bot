import {
    AuditLogEvent,
    Events,
    Guild,
    GuildAuditLogsEntry,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildAuditLogEntryCreate,

    async execute(
        auditLogEntry: GuildAuditLogsEntry,
        guild: Guild,
        client: ExtendedClient
    ) {
        // Only handle integration update events
        if (auditLogEntry.action !== AuditLogEvent.IntegrationUpdate) return;
        if (!guild) return;

        // Check if logging is enabled
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

        if (!loggingData?.Integration) return;

        const webhook = new WebhookClient({url: loggingData.Integration});

        try {
            const executor = auditLogEntry.executor;
            if (!executor) return;

            // Extract integration details from changes
            const changes = auditLogEntry.changes.map(change => ({
                key: change.key,
                old: change.old?.toString() || "None",
                new: change.new?.toString() || "None"
            }));

            // Format changes for display
            const formattedChanges = changes.map(change =>
                `> **${change.key.replace(/([A-Z])/g, ' $1').trim()}**: \`${change.old}\` → \`${change.new}\``
            );

            // Get integration name (either from changes or target)
            const integrationName = changes.find(c => c.key === 'name')?.new ||
                auditLogEntry.target?.toString() ||
                "Unknown";

            // Prepare the log message
            const messageContent = [
                `### Integration Updated`,
                ``,
                `> **Executor**: ${executor} (\`${executor.id}\`)`,
                `> **Integration**: \`${integrationName}\``,
                ``,
                ...formattedChanges,
                ``,
                `- **Updated at**: \`${new Date().toLocaleString()}\``
            ].join("\n");

            // Prepare the JSON data
            const jsonData = {
                integration: {
                    id: auditLogEntry.targetId,
                    name: integrationName,
                    changes: changes,
                    updatedAt: new Date().toISOString()
                },
                executor: {
                    id: executor.id,
                    username: executor.username,
                    tag: executor.tag,
                    avatarURL: executor.displayAvatarURL()
                },
                guild: {
                    id: guild.id,
                    name: guild.name
                },
                updateDetails: {
                    reason: auditLogEntry.reason || "Not specified"
                }
            };

            await loggingHelper(client,
                messageContent,
                webhook,
                JSON.stringify(jsonData, null, 2),
                "IntegrationUpdate"
            );
        } catch (error) {
            console.error("Error processing integration update:", error);
        }
    }
};