import {
    channelMention,
    Events,
    Message,
    userMention,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";

export default {
    name: Events.MessageUpdate,

    /**
     * @param {Message} oldMessage
     * @param {Message} newMessage
     * @param {ExtendedClient} client
     */
    async execute(
        oldMessage: Message,
        newMessage: Message,
        client: ExtendedClient
    ) {
        if (!oldMessage.guildId) return;
        if (newMessage.author?.id === client.user?.id) return;

        const guild = client.guilds.cache.get(oldMessage.guildId);
        if (!guild) return;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guild.id,
                LoggingEnabled: true
            }
        });

        if (!enabled?.LoggingEnabled) return;

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: guild.id
            }
        });

        if (!loggingData?.Message) return;

        if (oldMessage.content === newMessage.content) return;

        const webhook = new WebhookClient({url: loggingData.Message});

        const executor = newMessage.author;
        const channelId = newMessage.channel.id;
        const jumpLink = `https://discord.com/channels/${guild.id}/${channelId}/${newMessage.id}`;
        const memberMention = userMention(newMessage.member?.id || executor?.id || "unknown");

        if (!executor) return;

        if ((newMessage.content?.length || 0) > 1024) {
            const content = [
                `### ✏️ Message Updated`,
                ``,
                `### Executor`,
                `> ${memberMention}`,
                `> **User ID:** \`${executor.id}\``,
                `> **Username:** \`${executor.tag}\``,
                ``,
                `### Details`,
                `> **Channel:** ${channelMention(channelId)} (\`${channelId}\`)`,
                `> **Message ID:** \`${newMessage.id}\``,
                `> **Jump Link:** [Click here to view message](${jumpLink})`,
                ``,
                `### Content`,
                `> ⚠️ **Updated message content exceeds 1024 characters and cannot be displayed.**`,
                ``,
                `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
            ].join("\n");

            return loggingHelper(
                client,
                content,
                webhook,
                JSON.stringify(
                    {
                        action: "MessageUpdateTooLong",
                        guildId: guild.id,
                        authorId: executor.id,
                        oldMessage: oldMessage.content,
                        newMessage: newMessage.content
                    },
                    null,
                    2
                ),
                "MessageUpdate"
            );
        }

        const logContent = [
            `### ✏️ Message Updated`,
            ``,
            `### Executor`,
            `> ${memberMention}`,
            `> **User ID:** \`${executor.id}\``,
            `> **Username:** \`${executor.tag}\``,
            ``,
            `### Details`,
            `> **Channel:** ${channelMention(channelId)} (\`${channelId}\`)`,
            `> **Message ID:** \`${newMessage.id}\``,
            `> **Jump Link:** [Click here to view message](${jumpLink})`,
            ``,
            `### Content`,
            `> **Before:**`,
            `> ${oldMessage.content || "*No content*"}`,
            ``,
            `> **After:**`,
            `> ${newMessage.content || "*No content*"}`,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(client,
            logContent,
            webhook,
            JSON.stringify(
                {
                    action: "MessageUpdate",
                    guildId: guild.id,
                    authorId: executor.id,
                    oldMessage: oldMessage.content,
                    newMessage: newMessage.content
                },
                null,
                2
            ),
            "MessageUpdate"
        );
    }
};