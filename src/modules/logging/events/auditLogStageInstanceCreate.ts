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
    name: Events.StageInstanceCreate,

    /**
     * @param {StageInstance} stageInstance
     * @param {ExtendedClient} client
     */
    async execute(stageInstance: StageInstance, client: ExtendedClient) {
        const guild = stageInstance.guild;
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

        let creator = null;
        try {
            const auditLogs = await guild.fetchAuditLogs({
                type: AuditLogEvent.StageInstanceCreate,
                limit: 1
            });
            creator = auditLogs.entries.first()?.executor;
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
        }

        const createdTimestamp = Math.floor(stageInstance.createdTimestamp / 1000);

        const message = [
            `### 🎤 Stage Started`,
            ``,
            ...(creator ? [
                `### Creator`,
                `> <@${creator.id}>`,
                `> **User ID:** \`${creator.id}\``,
                `> **Username:** \`${creator.tag}\``,
                ``
            ] : []),
            `### Stage Details`,
            `> **Topic:** \`${stageInstance.topic || "No topic"}\``,
            `> **Stage ID:** \`${stageInstance.id}\``,
            `> **Channel:** <#${stageInstance.channel?.id}>`,
            `> **Privacy Level:** \`${getPrivacyLevelName(stageInstance.privacyLevel as any)}\``,
            `> **Discoverable:** \`${stageInstance.discoverableDisabled ? "No" : "Yes"}\``,
            `> **Created:** <t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)`,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify({
                stageInstance: {
                    id: stageInstance.id,
                    topic: stageInstance.topic,
                    channelId: stageInstance.channelId,
                    guildId: stageInstance.guildId,
                    privacyLevel: getPrivacyLevelName(stageInstance.privacyLevel as any),
                    discoverableDisabled: stageInstance.discoverableDisabled,
                    createdAt: new Date(stageInstance.createdTimestamp).toISOString()
                },
                creator: creator ? {
                    id: creator.id,
                    username: creator.username,
                    tag: creator.tag
                } : null
            }, null, 2),
            "StageInstanceCreate"
        );
    }
};