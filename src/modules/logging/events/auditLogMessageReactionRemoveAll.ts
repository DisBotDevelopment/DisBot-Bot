import {
    AuditLogEvent,
    Events,
    MessageReaction,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
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

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: guildId
            }
        });

        if (!loggingData?.Reaction) return;

        const webhook = new WebhookClient({url: loggingData.Reaction});

        let moderator = null;

        const messageLink = `https://discord.com/channels/${guildId}/${reaction.message.channel.id}/${reaction.message.id}`;

        const emojiDisplay = reaction.emoji.id
            ? `<:${reaction.emoji.name}:${reaction.emoji.id}>`
            : reaction.emoji.name || "Unknown";

        const message = [
            `### 🗑️ Emoji Reactions Removed`,
            ``,
            `### Removed Emoji`,
            `> **Emoji:** ${emojiDisplay}`,
            `> **Emoji Name:** \`${reaction.emoji.name || "Unknown"}\``,
            ...(reaction.emoji.id ? [
                `> **Emoji ID:** \`${reaction.emoji.id}\``,
                `> **Custom Emoji:** \`Yes\``
            ] : [
                `> **Custom Emoji:** \`No\``
            ]),
            ``,
            `### Message Details`,
            ...(reaction.message.author ? [
                `> **Message Author:** <@${reaction.message.author.id}> (\`${reaction.message.author.tag}\`)`
            ] : []),
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
                author: reaction.message.author
                    ? {
                        id: reaction.message.author.id,
                        username: reaction.message.author.username,
                        tag: reaction.message.author.tag
                    }
                    : null,
                moderator: moderator ? {
                    id: moderator.id,
                    username: moderator.username,
                    tag: moderator.tag
                } : null,
                messageUrl: messageLink
            }, null, 2),
            "MessageReactionRemoveEmoji"
        );
    }
};