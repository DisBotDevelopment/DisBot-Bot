import {
    AuditLogEvent,
    Events,
    StageInstance,
    GuildScheduledEventPrivacyLevel,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

function getPrivacyLevelName(level: GuildScheduledEventPrivacyLevel): string {
    const levels: Record<GuildScheduledEventPrivacyLevel, string> = {
        [GuildScheduledEventPrivacyLevel.GuildOnly]: "Guild Only"
    };
    return levels[level] || `Unknown (${level})`;
}

export default {
    name: Events.StageInstanceUpdate,

    /**
     * @param {StageInstance} oldStageInstance
     * @param {StageInstance} newStageInstance
     * @param {ExtendedClient} client
     */
    async execute(
        oldStageInstance: StageInstance,
        newStageInstance: StageInstance,
        client: ExtendedClient
    ) {
        const guild = newStageInstance.guild;
        if (!guild) return;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guild.id,
                LoggingEnabled: true
            }
        });

        if (!enabled || !enabled.LoggingEnabled) return;

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: guild.id
            }
        });

        if (!loggingData || !loggingData.Stage) return;

        const webhook = new WebhookClient({url: loggingData.Stage});

        let updater = null;
        try {
            const auditLogs = await guild.fetchAuditLogs({
                type: AuditLogEvent.StageInstanceUpdate,
                limit: 1
            });
            updater = auditLogs.entries.first()?.executor;
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
        }

        const changes: string[] = [];

        if (oldStageInstance.topic !== newStageInstance.topic) {
            changes.push(
                `> **Topic**`,
                `> Before: \`${oldStageInstance.topic || "No topic"}\``,
                `> After: \`${newStageInstance.topic || "No topic"}\``
            );
        }

        if (oldStageInstance.privacyLevel !== newStageInstance.privacyLevel) {
            changes.push(
                `> **Privacy Level**`,
                `> Before: \`${getPrivacyLevelName(oldStageInstance.privacyLevel as any)}\``,
                `> After: \`${getPrivacyLevelName(newStageInstance.privacyLevel as any)}\``
            );
        }

        if (oldStageInstance.discoverableDisabled !== newStageInstance.discoverableDisabled) {
            changes.push(
                `> **Discoverable**`,
                `> Before: \`${oldStageInstance.discoverableDisabled ? "No" : "Yes"}\``,
                `> After: \`${newStageInstance.discoverableDisabled ? "No" : "Yes"}\``
            );
        }

        if (changes.length === 0) return;

        const message = [
            `### 🔄 Stage Updated`,
            ``,
            ...(updater ? [
                `### Executor`,
                `> <@${updater.id}>`,
                `> **User ID:** \`${updater.id}\``,
                `> **Username:** \`${updater.tag}\``,
                ``
            ] : []),
            `### Stage Details`,
            `> **Topic:** \`${newStageInstance.topic || "No topic"}\``,
            `> **Stage ID:** \`${newStageInstance.id}\``,
            `> **Channel:** <#${newStageInstance.channel?.id}>`,
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
                    oldStageInstance: {
                        id: oldStageInstance.id,
                        topic: oldStageInstance.topic,
                        channelId: oldStageInstance.channelId,
                        guildId: oldStageInstance.guildId,
                        privacyLevel: getPrivacyLevelName(oldStageInstance.privacyLevel as any),
                        discoverableDisabled:
                        oldStageInstance.discoverableDisabled
                    },
                    newStageInstance: {
                        id: newStageInstance.id,
                        topic:
                        newStageInstance.topic,
                        channelId:
                        newStageInstance.channelId,
                        guildId:
                        newStageInstance.guildId,
                        privacyLevel:
                            getPrivacyLevelName(newStageInstance.privacyLevel as any),
                        discoverableDisabled:
                        newStageInstance.discoverableDisabled
                    }
                    ,
                    updater: updater ? {
                        id: updater.id,
                        username: updater.username,
                        tag: updater.tag
                    } : null
                },
                null, 2
            ),
            "StageInstanceUpdate"
        )
        ;
    }
};