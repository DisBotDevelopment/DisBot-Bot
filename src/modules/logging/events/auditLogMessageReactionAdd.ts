import {
    Events,
    MessageReaction,
    MessageReactionEventDetails,
    User,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
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

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: guildId
            }
        });

        if (!loggingData?.Reaction) return;

        const webhook = new WebhookClient({url: loggingData.Reaction});

        const messageLink = `https://discord.com/channels/${guildId}/${reaction.message.channel.id}/${reaction.message.id}`;

        const emojiDisplay = reaction.emoji.id
            ? `<:${reaction.emoji.name}:${reaction.emoji.id}>`
            : reaction.emoji.name || "Unknown";

        const message = [
            `### ➕ Reaction Added`,
            ``,
            `### User`,
            `> <@${user.id}>`,
            `> **User ID:** \`${user.id}\``,
            `> **Username:** \`${user.tag}\``,
            ``,
            `### Reaction Details`,
            `> **Emoji:** ${emojiDisplay}`,
            `> **Emoji Name:** \`${reaction.emoji.name || "Unknown"}\``,
            ...(reaction.emoji.id ? [
                `> **Emoji ID:** \`${reaction.emoji.id}\``,
                `> **Custom Emoji:** \`Yes\``
            ] : [
                `> **Custom Emoji:** \`No\``
            ]),
            ``,
            `### Message`,
            `> **Channel:** <#${reaction.message.channel.id}>`,
            `> **Message ID:** \`${reaction.message.id}\``,
            `> **Jump Link:** [Click here to view message](${messageLink})`,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify({
                messageId: reaction.message.id,
                channelId: reaction.message.channel.id,
                guildId,
                emoji: {
                    name: reaction.emoji.name,
                    id: reaction.emoji.id,
                    animated: reaction.emoji.animated,
                    url: reaction.emoji.imageURL()
                },
                user: {
                    id: user.id,
                    username: user.username,
                    tag: user.tag
                },
                messageUrl: messageLink
            }, null, 2),
            "MessageReactionAdd"
        );
    }
};