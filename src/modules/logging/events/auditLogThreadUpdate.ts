import {
    Events,
    ThreadChannel,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.ThreadUpdate,

    /**
     * @param {ThreadChannel} oldThread
     * @param {ThreadChannel} newThread
     * @param {ExtendedClient} client
     */
    async execute(
        oldThread: ThreadChannel,
        newThread: ThreadChannel,
        client: ExtendedClient
    ) {
        if (!newThread.guild) return;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: newThread.guild.id,
                LoggingEnabled: true
            }
        });

        if (!enabled || !enabled.LoggingEnabled) return;

        const loggingData = await database.guildLoggings.findFirst({
            where: {
                GuildId: newThread.guild.id
            }
        });

        if (!loggingData || !loggingData.Thread) return;

        const webhook = new WebhookClient({url: loggingData.Thread});
        const owner = newThread.guild.members.cache.get(newThread.ownerId);
        const updateTime = new Date();

        // Collect all changes
        const changes = [];

        // Name change
        if (oldThread.name !== newThread.name) {
            changes.push(`> **Name Changed:** \`${oldThread.name}\` → \`${newThread.name}\``);
        }

        // Archive status change
        if (oldThread.archived !== newThread.archived) {
            changes.push(`> **Status Changed:** ${oldThread.archived ? "Archived" : "Active"} → ${newThread.archived ? "Archived" : "Active"}`);
        }

        // Lock status change
        if (oldThread.locked !== newThread.locked) {
            changes.push(`> **Lock Status Changed:** ${oldThread.locked ? "Locked" : "Unlocked"} → ${newThread.locked ? "Locked" : "Unlocked"}`);
        }

        // Slowmode change
        if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
            const oldRate = oldThread.rateLimitPerUser ? `${oldThread.rateLimitPerUser / 1000}s` : "Off";
            const newRate = newThread.rateLimitPerUser ? `${newThread.rateLimitPerUser / 1000}s` : "Off";
            changes.push(`> **Slowmode Changed:** ${oldRate} → ${newRate}`);
        }

        // If no changes detected, skip logging
        if (changes.length === 0) return;

        await loggingHelper(client,
            [
                "### Thread Updated",
                "",
                ...changes,
                "",
                `> **Creator:** <@${owner?.id}> (\`${owner?.id}\`)`,
                `> **Channel:** <#${newThread.parentId}>`,
                `> **Updated At:** \`${updateTime.toLocaleString()}\``,
                "",
                `-# **Thread ID:** ${newThread.id}`,
                `-# **Owner Tag:** @${owner?.user.tag}`
            ].join("\n"),
            webhook,
            JSON.stringify({
                oldThread: {
                    name: oldThread.name,
                    archived: oldThread.archived,
                    locked: oldThread.locked,
                    rateLimitPerUser: oldThread.rateLimitPerUser,
                    autoArchiveDuration: oldThread.autoArchiveDuration
                },
                newThread: {
                    name: newThread.name,
                    archived: newThread.archived,
                    locked: newThread.locked,
                    rateLimitPerUser: newThread.rateLimitPerUser,
                    autoArchiveDuration: newThread.autoArchiveDuration
                },
                owner: owner?.user,
                updatedAt: updateTime.toISOString()
            }),
            "ThreadUpdate"
        );
    }
};