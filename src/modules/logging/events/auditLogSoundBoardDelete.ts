import {
    APIAuditLogEntry,
    AuditLogEvent,
    Events,
    Guild,
    WebhookClient,
    userMention
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";

export default {
    name: Events.GuildAuditLogEntryCreate,

    /**
     * @param {APIAuditLogEntry} auditLogEntry
     * @param {Guild} guild
     * @param {ExtendedClient} client
     */
    async execute(
        auditLogEntry: APIAuditLogEntry,
        guild: Guild,
        client: ExtendedClient
    ) {
        const guildId = guild.id;

        // Logging aktiviert?
        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guildId,
                LoggingEnabled: true
            }
        });
        if (!enabled?.LoggingEnabled) return;

        // Logging-URLs abrufen
        const data = await database.guildLoggings.findFirst({
            where: {GuildId: guildId}
        });
        if (!data?.SoundBoard) return;

        // Nur Soundboard-Löschaktion
        if (auditLogEntry.action_type !== AuditLogEvent.SoundboardSoundDelete) return;

        const logs = await guild.fetchAuditLogs({
            type: AuditLogEvent.SoundboardSoundDelete
        });

        const logEntry = logs.entries.first();
        if (!logEntry) return;

        const executor = logEntry.executor;
        const sound = logEntry.target as any;
        const webhook = new WebhookClient({url: data.SoundBoard});

        const content = [
            `### Soundboard Sound Deleted`,
            ``,
            `> **Soundboard Name:** \`${sound?.name || "Unknown"}\``,
            `> **Deleted by:** ${userMention(executor?.id || "")} (\`${executor?.id || "Unknown"}\`)`
        ].join("\n");

        await loggingHelper(client,
            content,
            webhook,
            JSON.stringify(
                {
                    action: "SoundboardDeleted",
                    guildId: guild.id,
                    soundName: sound?.name,
                    deletedBy: executor?.id
                },
                null,
                2
            ),
            "SoundboardDelete"
        );
    }
};
