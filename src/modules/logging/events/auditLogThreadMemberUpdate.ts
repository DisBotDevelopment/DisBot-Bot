import {
    Events,
    ThreadChannel,
    ThreadMember,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

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
        if (!thread.guild) {
            console.error("Guild not found for thread:", thread.id);
            return;
        }

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: thread.guild.id,
                LoggingEnabled: true
            }
        });

        if (!enabled || !enabled.LoggingEnabled) return;

        const loggingData = await database.guildLoggings.findFirst({
            where: {
                GuildId: thread.guild.id
            }
        });

        if (!loggingData || !loggingData.Thread) return;

        const webhook = new WebhookClient({url: loggingData.Thread});
        const actionTime = new Date();

        // Process all changes in a single batch
        const processMembers = async (members: Set<ThreadMember>, action: string) => {
            for (const member of members) {
                const user = await client.users.fetch(member.id).catch(() => null);
                if (!user) continue;

                await loggingHelper(client,
                    [
                        `### Thread Member ${action}`,
                        "",
                        `> **User:** <@${user.id}> (\`${user.tag}\`)`,
                        `> **Action:** \`${action} the thread\``,
                        `> **Thread:** \`${thread.name}\` (ID: \`${thread.id}\`)`,
                        `> **Channel:** <#${thread.parentId}>`,
                        `> **Action Time:** \`${actionTime.toLocaleString()}\``,
                        "",
                        `-# **Thread ID:** ${thread.id}`,
                        `-# **User ID:** ${user.id}`
                    ].join("\n"),
                    webhook,
                    JSON.stringify({
                        thread: {
                            id: thread.id,
                            name: thread.name,
                            parentId: thread.parentId
                        },
                        user: {
                            id: user.id,
                            tag: user.tag
                        },
                        action: action,
                        timestamp: actionTime.toISOString()
                    }),
                    `ThreadMember${action}`
                );
            }
        };

        // Process added members
        if (addedMembers.size > 0) {
            await processMembers(addedMembers, "Joined");
        }

        // Process removed members
        if (removedMembers.size > 0) {
            await processMembers(removedMembers, "Left");
        }
    }
};