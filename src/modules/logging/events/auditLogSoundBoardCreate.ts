import {
    APIAuditLogEntry,
    AuditLogEvent,
    Client,
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

        // Prisma: Logging aktiviert?
        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guildId,
                LoggingEnabled: true
            }
        });

        if (!enabled?.LoggingEnabled) return;

        // Prisma: URL holen
        const data = await database.guildLoggings.findFirst({
            where: {GuildId: guildId}
        });

        if (!data?.SoundBoard) return;

        // Action-Type 130 = Soundboard erstellt
        if (auditLogEntry.action_type !== 130) return;

        const logs = await guild.fetchAuditLogs({
            type: AuditLogEvent.SoundboardSoundCreate
        });

        const logEntry = logs.entries.first();
        if (!logEntry) return;

        const executor = logEntry.executor;
        const sound = logEntry.target as any; // Soundboard sounds haben keine klare Typisierung
        const webhook = new WebhookClient({url: data.SoundBoard});

        const content = [
            `### New Soundboard Created`,
            ``,
            `> **Soundboard Name:** \`${sound?.name || "Unknown"}\``,
            `> **Created by:** ${userMention(executor?.id || "")} (\`${executor?.id || "Unknown"}\`)`
        ].join("\n");

        await loggingHelper(client,
            content,
            webhook,
            JSON.stringify(
                {
                    action: "SoundboardCreated",
                    guildId: guild.id,
                    soundName: sound?.name,
                    createdBy: executor?.id
                },
                null,
                2
            ),
            "SoundboardCreate"
        );
    }
};
