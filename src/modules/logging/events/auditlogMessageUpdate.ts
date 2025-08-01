import {
    channelMention,
    Events,
    Message,
    userMention,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
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

        const loggingData = await database.guildLoggings.findFirst({
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
                `### Message Updated (Content Too Long)`,
                ``,
                `> **Member:** ${memberMention} (\`${executor.id}\`)`,
                `> **Channel:** ${channelMention(channelId)} (\`${channelId}\`)`,
                ``,
                `> **Message URL:** [\`Jump to message\`](${jumpLink})`,
                ``,
                `**Updated message content exceeds 1024 characters and cannot be displayed.**`
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
            `### Message Updated`,
            ``,
            `> **Member:** ${memberMention} (\`${executor.id}\`)`,
            `> **Channel:** ${channelMention(channelId)} (\`${channelId}\`)`,
            ``,
            `> **Old Message:**`,
            oldMessage.content || "*No content*",
            ``,
            `> **Message URL:** [\`Jump to message\`](${jumpLink})`,
            ``,
            `> **Updated Message:**`,
            newMessage.content || "*No content*"
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
