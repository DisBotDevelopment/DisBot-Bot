import {
    AuditLogEvent,
    EmbedBuilder,
    Events,
    GuildChannel,
    WebhookClient,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";

export default {
    name: Events.ChannelDelete,

    /**
     * @param {GuildChannel} channel
     * @param {ExtendedClient} client
     */
    async execute(channel: GuildChannel, client: ExtendedClient) {
        const guild = channel.guild;

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
        if (!loggingData?.Channel) return;

        const webhook = new WebhookClient({url: loggingData.Channel});

        // Audit-Logs zum Löschen abrufen
        const logs = await guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelDelete,
            limit: 1,
        });

        const logEntry = logs.entries.first();
        const executor = logEntry?.executor;

        const typeMap: Record<number, string> = {
            0: "Text",
            2: "Voice",
            13: "Stage",
            15: "Form",
            5: "Announcement",
            4: "Category",
        };

        const typeName = typeMap[channel.type as number] ?? "Unknown";
        const categoryName = channel.parent?.name ?? "None";

        await loggingHelper(client,
            `### Channel Deleted\n> **Channel Name**: #${channel.name}\n**Executor**: @${executor?.tag ?? "Unknown"}`,
            webhook,
            JSON.stringify({
                channelId: channel.id,
                channelName: channel.name,
                channelType: typeName,
                category: categoryName,
                executor: executor?.tag ?? null,
            }),
            "ChannelDelete"
        );
    },
};
