import {
    EmbedBuilder,
    Events,
    MessageReaction,
    MessageReactionEventDetails,
    User,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";

export default {
    name: Events.MessageReactionAdd,

    /**
     * @param {MessageReaction} reaction
     * @param {User} user
     * @param {MessageReactionEventDetails} details
     * @param {ExtendedClient} client
     */
    async execute(
        reaction: MessageReaction,
        user: User,
        details: MessageReactionEventDetails,
        client: ExtendedClient
    ) {
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
            `### Reaction Added`,
            ``,
            `> **Message Link:** [\`Jump to message\`](${messageLink})`,
            `> **User:** <@${user.id}> (\`${user.id}\`)`,
            `> **Emoji:** ${reaction.emoji.name || "Custom Emoji"}`,
            ``,
            `-# **Tag:** @${user.tag}`
        ].join("\n");

        await loggingHelper(client,
            logMessage,
            webhook,
            JSON.stringify({
                messageId: reaction.message.id,
                channelId: reaction.message.channel.id,
                guildId,
                emoji: reaction.emoji,
                user: {
                    id: user.id,
                    tag: user.tag
                }
            }, null, 2),
            "MessageReactionAdd"
        );
    }
};
