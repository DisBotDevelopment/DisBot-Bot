import {
    Events,
    Message,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";

export default {
    name: Events.MessageReactionRemoveAll,

    /**
     * @param {Message} message
     * @param {ExtendedClient} client
     */
    async execute(message: Message, client: ExtendedClient) {
        const guildId = message.guild?.id;
        if (!guildId) return;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guildId,
                LoggingEnabled: true
            }
        });

        if (!enabled?.LoggingEnabled) return;

        const loggingData = await database.guildLoggings.findFirst({
            where: {
                GuildId: guildId
            }
        });

        if (!loggingData?.Reaction) return;

        const webhook = new WebhookClient({url: loggingData.Reaction});

        const messageLink = `https://discord.com/channels/${guildId}/${message.channel.id}/${message.id}`;

        const logMessage = [
            `### All Reactions Removed`,
            ``,
            `> **Message Link:** [\`Jump to message\`](${messageLink})`,
            `> **Author:** <@${message.author.id}> (\`${message.author.id}\`)`,
            ``,
            `**Removed all Reactions from Message**`
        ].join("\n");

        await loggingHelper(client,
            logMessage,
            webhook,
            JSON.stringify({
                messageId: message.id,
                channelId: message.channel.id,
                guildId,
                author: {
                    id: message.author.id,
                    tag: message.author.tag
                },
                content: message.content
            }, null, 2),
            "MessageReactionRemoveAll"
        );
    }
};
