import {
    APIAuditLogEntry,
    AuditLogEvent,
    Events,
    Guild,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
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

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guildId,
                LoggingEnabled: true
            }
        });
        if (!enabled?.LoggingEnabled) return;

        const data = await database.guildLogging.findFirst({
            where: {GuildId: guildId}
        });
        if (!data?.SoundBoard) return;

        if (auditLogEntry.action_type !== AuditLogEvent.SoundboardSoundDelete) return;

        const logs = await guild.fetchAuditLogs({
            type: AuditLogEvent.SoundboardSoundDelete
        });

        const logEntry = logs.entries.first();
        if (!logEntry) return;

        const executor = logEntry.executor;
        const sound = logEntry.target as any;
        const webhook = new WebhookClient({url: data.SoundBoard});

        const message = [
            `### 🗑️ Soundboard Sound Deleted`,
            ``,
            `### Executor`,
            ...(executor ? [
                `> <@${executor.id}>`,
                `> **User ID:** \`${executor.id}\``,
                `> **Username:** \`${executor.tag}\``
            ] : [
                `> *Unknown Executor*`
            ]),
            ``,
            `### Deleted Sound`,
            `> **Name:** \`${sound?.name || "Unknown"}\``,
            ...(sound?.soundId ? [
                `> **Sound ID:** \`${sound.soundId}\``
            ] : []),
            ...(sound?.volume !== undefined ? [
                `> **Volume:** \`${sound.volume}\``
            ] : []),
            ...(sound?.emojiId ? [
                `> **Emoji ID:** \`${sound.emojiId}\``
            ] : []),
            ...(sound?.emojiName ? [
                `> **Emoji Name:** \`${sound.emojiName}\``
            ] : []),
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify({
                action: "SoundboardSoundDeleted",
                guildId: guild.id,
                sound: {
                    name: sound?.name,
                    soundId: sound?.soundId,
                    volume: sound?.volume,
                    emojiId: sound?.emojiId,
                    emojiName: sound?.emojiName
                },
                executor: executor ? {
                    id: executor.id,
                    username: executor.username,
                    tag: executor.tag
                } : null
            }, null, 2),
            "SoundboardDelete"
        );
    }
};