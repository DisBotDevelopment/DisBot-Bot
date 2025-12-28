import {
    AuditLogEvent,
    ChannelType,
    Events,
    GuildChannel,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";

function getChannelTypeName(type: ChannelType): string {
    const types: Record<ChannelType, string> = {
        [ChannelType.GuildText]: "Text Channel",
        [ChannelType.GuildVoice]: "Voice Channel",
        [ChannelType.GuildCategory]: "Category",
        [ChannelType.GuildAnnouncement]: "Announcement Channel",
        [ChannelType.AnnouncementThread]: "Announcement Thread",
        [ChannelType.PublicThread]: "Public Thread",
        [ChannelType.PrivateThread]: "Private Thread",
        [ChannelType.GuildStageVoice]: "Stage Channel",
        [ChannelType.GuildDirectory]: "Directory",
        [ChannelType.GuildForum]: "Forum Channel",
        [ChannelType.GuildMedia]: "Media Channel",
        [ChannelType.DM]: "DM",
        [ChannelType.GroupDM]: "Group DM"
    };
    return types[type] || `Unknown (${type})`;
}

export default {
    name: Events.ChannelCreate,

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

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: guild.id,
            },
        });

        if (!enabled || !enabled.LoggingEnabled) return;
        if (!loggingData?.Channel) return;

        const webhook = new WebhookClient({url: loggingData.Channel});

        const logs = await guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelCreate,
            limit: 1,
        });

        const logEntry = logs.entries.first();
        const executor = logEntry?.executor;

        const category = channel.parent?.name ?? "None";
        const typeName = getChannelTypeName(channel.type);

        const message = [
            `### ➕ Channel Created`,
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
            `### Channel Details`,
            `> **Name:** <#${channel.id}> (\`${channel.name}\`)`,
            `> **Channel ID:** \`${channel.id}\``,
            `> **Type:** \`${typeName}\``,
            `> **Category:** \`${category}\``,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify({
                channelId: channel.id,
                channelName: channel.name,
                channelType: typeName,
                category,
                executor: executor ? {id: executor.id, tag: executor.tag} : null,
            }, null, 2),
            "ChannelCreate"
        );
    },
};