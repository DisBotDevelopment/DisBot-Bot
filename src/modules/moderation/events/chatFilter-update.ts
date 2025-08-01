import {EmbedBuilder, Events, Message, TextChannel, WebhookClient} from "discord.js";
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
    async execute(oldMessage: Message, newMessage: Message, client: ExtendedClient) {
        if (!oldMessage.inGuild() || newMessage.author?.bot) return;

        const {guild, channel, member} = oldMessage;
        if (!guild || !member) return;

        if (oldMessage.webhookId || newMessage.webhookId) return;

        const toggleData = await database.guildFeatureToggles.findFirst({
            where: {GuildId: guild.id}
        });

        if (!toggleData?.ChatfilterEnabled) return;

        const chatfilterData = await database.chatModerations.findFirst({
            where: {GuildId: guild.id}
        });

        if (!chatfilterData || !chatfilterData.Words?.length) return;

        const memberCache = guild.members.cache.get(member.id);
        if (!memberCache) return;

        // Whitelist Check
        const isWhitelistedChannel = chatfilterData.WhiteListChannel?.includes(channel.id);
        const isWhitelistedRole = chatfilterData.WhiteListRole?.some(roleId =>
            memberCache.roles.cache.has(roleId)
        );

        if (isWhitelistedChannel || isWhitelistedRole) return;

        const newContent = newMessage.content?.toLowerCase() ?? "";
        const oldContent = oldMessage.content?.toLowerCase() ?? "";

        for (const word of chatfilterData.Words) {
            const lowerWord = word.toLowerCase();
            if (newContent.includes(lowerWord)) {
                const logChannel = client.channels.cache.get(chatfilterData.LogChannelId) as TextChannel;

                if (logChannel) {

                    let webhook;
                    const channelWebhooks = await logChannel.fetchWebhooks()
                    const chatFilterWebhook = channelWebhooks.find((w) => w.name == "ChatFilter");

                    if (!chatFilterWebhook) {
                        webhook = await logChannel.createWebhook(
                            {
                                name: "ChatFilter",
                                avatar: logChannel.guild.iconURL(),
                            }
                        )
                    } else {
                        webhook = chatFilterWebhook
                    }

                    const webhookClient = new WebhookClient({
                        url: webhook.url,
                    })

                    await loggingHelper(
                        client,
                        [`### ChatFilter Triggered`,
                            `> Channel: ${channel}`,
                            `> User: ${newMessage.author}`,
                            `> New Message: \`${newMessage.content}\``,
                            `> Old Message: \`${oldMessage.content}\``,
                            ``,
                            `**Message ID:** \`${newMessage.id}\``,
                            `**Channel ID:** \`${channel.id}\``,
                            `**User ID:** \`${newMessage.author?.id ?? "?"}\``].join("\n"),
                        webhookClient,
                        JSON.stringify({
                            newMessage: newMessage,
                            oldMessage: oldMessage,
                        }),
                        "ChatFilterEvent"
                    )
                }

                await newMessage.delete().catch(() => null);
                break;
            }
        }
    }
};
