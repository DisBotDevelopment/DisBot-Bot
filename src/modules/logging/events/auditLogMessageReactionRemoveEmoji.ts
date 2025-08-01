import {
    Events,
    MessageReaction,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";

export default {
    name: Events.MessageReactionRemoveEmoji,

    /**
     * @param {MessageReaction} reaction
     * @param {ExtendedClient} client
     */
    async execute(reaction: MessageReaction, client: ExtendedClient) {
        const guildId = reaction.message.guild?.id;
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

        const messageLink = `https://discord.com/channels/${guildId}/${reaction.message.channel.id}/${reaction.message.id}`;

        const logMessage = [
            `### Reaction Emoji Removed`,
            ``,
            `> **Message Link:** [\`Jump to message\`](${messageLink})`,
            `> **Emoji Removed:** ${reaction.emoji.name}`
        ].join("\n");

        await loggingHelper(client,
            logMessage,
            webhook,
            JSON.stringify({
                messageId: reaction.message.id,
                channelId: reaction.message.channel.id,
                guildId,
                emoji: {
                    name: reaction.emoji.name,
                    id: reaction.emoji.id,
                    animated: reaction.emoji.animated
                },
                author: reaction.message.author
                    ? {
                        id: reaction.message.author.id,
                        tag: reaction.message.author.tag
                    }
                    : null
            }, null, 2),
            "MessageReactionRemoveEmoji"
        );
    }
};
