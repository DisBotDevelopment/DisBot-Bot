import {
    Events,
    ThreadChannel,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.ThreadCreate,

    /**
     * @param {ThreadChannel} thread
     * @param {ExtendedClient} client
     */
    async execute(thread: ThreadChannel, client: ExtendedClient) {
        if (!thread.guild) return;

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
        const owner = thread.guild.members.cache.get(thread.ownerId);

        await loggingHelper(client,
            [
                "### Thread Created",
                "",
                `> **Creator:** <@${owner?.id}> (\`${owner?.id}\`)`,
                `> **Thread Name:** <#${thread.id}> (\`${thread.name}\`)`,
                `> **Channel:** <#${thread.parentId}>`,
                `> **Created At:** \`${thread.createdAt?.toLocaleString()}\``,
                `> **Type:** \`${thread.type}\``,
                `> **Archived:** \`${thread.archived ? "Yes" : "No"}\``,
                `> **Locked:** \`${thread.locked ? "Yes" : "No"}\``,
                "",
                `-# **Thread ID:** ${thread.id}`,
                `-# **Owner Tag:** @${owner?.user.tag}`
            ].join("\n"),
            webhook,
            JSON.stringify({
                thread: {
                    id: thread.id,
                    name: thread.name,
                    type: thread.type,
                    parentId: thread.parentId,
                    ownerId: thread.ownerId,
                    createdAt: thread.createdAt,
                    archived: thread.archived,
                    locked: thread.locked,
                    rateLimitPerUser: thread.rateLimitPerUser
                },
                owner: owner?.user
            }),
            "ThreadCreate"
        );
    }
};