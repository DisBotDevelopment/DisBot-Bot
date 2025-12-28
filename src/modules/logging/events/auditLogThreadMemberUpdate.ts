import {
    ChannelType,
    Events,
    ThreadChannel,
    ThreadMember,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

function getThreadTypeName(type: ChannelType): string {
    const types: Record<ChannelType, string> = {
        [ChannelType.PublicThread]: "Public Thread",
        [ChannelType.PrivateThread]: "Private Thread",
        [ChannelType.AnnouncementThread]: "Announcement Thread",
        [ChannelType.GuildText]: "Text Channel",
        [ChannelType.GuildVoice]: "Voice Channel",
        [ChannelType.GuildCategory]: "Category",
        [ChannelType.GuildAnnouncement]: "Announcement Channel",
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
    name: Events.ThreadMembersUpdate,

    /**
     * @param {Set<ThreadMember>} addedMembers
     * @param {Set<ThreadMember>} removedMembers
     * @param {ThreadChannel} thread
     * @param {ExtendedClient} client
     */
    async execute(
        addedMembers: Set<ThreadMember>,
        removedMembers: Set<ThreadMember>,
        thread: ThreadChannel,
        client: ExtendedClient
    ) {
        if (!thread.guild) return;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: thread.guild.id,
                LoggingEnabled: true
            }
        });

        if (!enabled || !enabled.LoggingEnabled) return;

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: thread.guild.id
            }
        });

        if (!loggingData || !loggingData.Thread) return;

        const webhook = new WebhookClient({url: loggingData.Thread});

        const processMembers = async (members: Set<ThreadMember>, action: "Joined" | "Left", emoji: string) => {
            for (const member of members) {
                const user = await client.users.fetch(member.id).catch(() => null);
                if (!user) continue;

                const message = [
                    `### ${emoji} Thread Member ${action}`,
                    ``,
                    `### User`,
                    `> <@${user.id}>`,
                    `> **User ID:** \`${user.id}\``,
                    `> **Username:** \`${user.tag}\``,
                    ``,
                    `### Thread Details`,
                    `> **Thread:** <#${thread.id}> (\`${thread.name}\`)`,
                    `> **Thread ID:** \`${thread.id}\``,
                    `> **Type:** \`${getThreadTypeName(thread.type)}\``,
                    `> **Parent Channel:** <#${thread.parentId}>`,
                    ``,
                    `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
                ].join("\n");

                await loggingHelper(
                    client,
                    message,
                    webhook,
                    JSON.stringify({
                        thread: {
                            id: thread.id,
                            name: thread.name,
                            type: getThreadTypeName(thread.type),
                            parentId: thread.parentId
                        },
                        user: {
                            id: user.id,
                            username: user.username,
                            tag: user.tag
                        },
                        action: action,
                        timestamp: new Date().toISOString()
                    }, null, 2),
                    `ThreadMember${action}`
                );
            }
        };

        if (addedMembers.size > 0) {
            await processMembers(addedMembers, "Joined", "➕");
        }

        if (removedMembers.size > 0) {
            await processMembers(removedMembers, "Left", "➖");
        }
    }
};