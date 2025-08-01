import {
    AuditLogEvent,
    EmbedBuilder,
    Events,
    GuildChannel,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";

export default {
    name: Events.ChannelCreate,

    /**
     * @param {GuildChannel} channel
     * @param {ExtendedClient} client
     */
    async execute(channel: GuildChannel, client: ExtendedClient) {
        const guild = channel.guild;

        // Prisma: Prüfen ob Logging aktiviert ist
        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guild.id,
                LoggingEnabled: true,
            },
        });

        // Prisma: Logging-Config (Webhook URL) abfragen
        const loggingData = await database.guildLoggings.findFirst({
            where: {
                GuildId: guild.id,
            },
        });

        if (!enabled || !enabled.LoggingEnabled) return;
        if (!loggingData?.Channel) return;

        const webhook = new WebhookClient({url: loggingData.Channel});

        // Auditlogs für ChannelCreate holen
        const logs = await guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelCreate,
            limit: 1,
        });

        const logEntry = logs.entries.first();
        const executor = logEntry?.executor;

        // Channel-Typ übersetzen
        const typeMap: Record<number, string> = {
            0: "Text",
            2: "Voice",
            13: "Stage",
            15: "Form",
            5: "Announcement",
            4: "Category",
        };

        const category = channel.parent?.name ?? "None";
        const typeName = typeMap[channel.type as number] ?? "Unknown";

        await loggingHelper(client,
            `### Channel Created\n> **Channel Name**: <#${channel.id}> (${channel.name})\n**Executor**: @${executor?.tag ?? "Unknown"}`,
            webhook,
            JSON.stringify({
                channelId: channel.id,
                channelName: channel.name,
                channelType: typeName,
                category,
                executor: executor?.tag ?? null,
            }),
            "ChannelCreate"
        );
    },
};
