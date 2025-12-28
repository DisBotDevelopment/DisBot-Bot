import {
    AuditLogEvent,
    Events,
    GuildSoundboardSound,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildSoundboardSoundUpdate,

    /**
     * @param {GuildSoundboardSound} oldSoundboardSound
     * @param {GuildSoundboardSound} newSoundboardSound
     * @param {ExtendedClient} client
     */
    async execute(
        oldSoundboardSound: GuildSoundboardSound,
        newSoundboardSound: GuildSoundboardSound,
        client: ExtendedClient
    ) {
        const guildId = oldSoundboardSound.guildId;
        if (!guildId) return;

        const guild = await client.guilds.fetch(guildId).catch(() => null);
        if (!guild) return;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {GuildId: guildId, LoggingEnabled: true}
        });
        if (!enabled) return;

        const loggingData = await database.guildLogging.findFirst({
            where: {GuildId: guildId}
        });
        if (!loggingData || !loggingData.SoundBoard) return;

        const webhook = new WebhookClient({url: loggingData.SoundBoard});

        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.SoundboardSoundUpdate,
            limit: 1
        });
        const logEntry = auditLogs.entries.first();
        const executor = logEntry?.executor;

        const changes: string[] = [];

        if (oldSoundboardSound.name !== newSoundboardSound.name) {
            changes.push(
                `> **Name**`,
                `> Before: \`${oldSoundboardSound.name}\``,
                `> After: \`${newSoundboardSound.name}\``
            );
        }

        if (oldSoundboardSound.volume !== newSoundboardSound.volume) {
            changes.push(
                `> **Volume**`,
                `> Before: \`${oldSoundboardSound.volume}\``,
                `> After: \`${newSoundboardSound.volume}\``
            );
        }

        if (oldSoundboardSound.emoji.id !== newSoundboardSound.emoji.id) {
            changes.push(
                `> **Emoji ID**`,
                `> Before: \`${oldSoundboardSound.emoji.id || "None"}\``,
                `> After: \`${newSoundboardSound.emoji.id || "None"}\``
            );
        }

        if (oldSoundboardSound.emoji.name !== newSoundboardSound.emoji.name) {
            changes.push(
                `> **Emoji Name**`,
                `> Before: \`${oldSoundboardSound.emoji.name || "None"}\``,
                `> After: \`${newSoundboardSound.emoji.name || "None"}\``
            );
        }

        if (changes.length === 0) return;

        const message = [
            `### 🔄 Soundboard Sound Updated`,
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
            `### Sound Details`,
            `> **Name:** \`${newSoundboardSound.name}\``,
            `> **Sound ID:** \`${newSoundboardSound.soundId}\``,
            ``,
            `### Changes`,
            ...changes,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify({
                action: "SoundboardSoundUpdated",
                guildId: guild.id,
                oldSound: oldSoundboardSound,
                newSound: newSoundboardSound,
                executor: executor ? {
                    id: executor.id,
                    username: executor.username,
                    tag: executor.tag
                } : null
            }, null, 2),
            "SoundboardUpdate"
        );
    }
};