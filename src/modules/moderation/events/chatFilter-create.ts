import {EmbedBuilder, Events, Message, TextChannel, WebhookClient} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {Channel} from "diagnostics_channel";

export default {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     * @param {ExtendedClient} client
     */
    async execute(message: Message, client: ExtendedClient) {
        if (!message.inGuild() || message.author.bot) return;

        const {guild, content, channel, member} = message;
        if (!guild || !member) return;

        const toggleData = await database.guildFeatureToggles.findFirst({
            where: {GuildId: guild.id}
        });

        if (!toggleData?.ChatfilterEnabled) return;

        const messageContent = content.toLowerCase();
        if (message.webhookId) return;

        const chatfilterData = await database.chatModerations.findFirst({
            where: {GuildId: guild.id}
        });

        console.log(chatfilterData)

        if (!chatfilterData || !chatfilterData.Words?.length) return;

        const memberCache = guild.members.cache.get(member.id);
        if (!memberCache) return;

        // Whitelist Check
        const isWhitelistedChannel = chatfilterData.WhiteListChannel?.includes(channel.id);
        const isWhitelistedRole = chatfilterData.WhiteListRole?.some(roleId =>
            memberCache.roles.cache.has(roleId)
        );

        if (isWhitelistedChannel || isWhitelistedRole) return;

        // Check for blacklisted words
        for (const word of chatfilterData.Words) {
            console.log(word)
            if (messageContent.includes(word.toLowerCase())) {

                console.log("yes")

                const logChannel = client.channels.cache.get(chatfilterData.LogChannelId) as TextChannel;

                const embed = new EmbedBuilder()
                    .setTitle("ChatFilter Triggered")
                    .setColor("#2B2D31")
                    .setDescription([
                        `> Channel: ${channel}`,
                        `> Message: \`${message.cleanContent}\``,
                        `> User: ${message.author}`,
                        ``,
                        `**Message ID:** \`${message.id}\``,
                        `**Channel ID:** \`${channel.id}\``,
                        `**User ID:** \`${message.author.id}\``
                    ].join("\n"))
                    .setFooter({
                        text: `@${message.author.username}`,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTimestamp();

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
                            `> Message: \`${message.cleanContent}\``,
                            `> User: ${message.author}`,
                            ``,
                            `**Message ID:** \`${message.id}\``,
                            `**Channel ID:** \`${channel.id}\``,
                            `**User ID:** \`${message.author.id}\``].join("\n"),
                        webhookClient,
                        JSON.stringify(message),
                        "ChatFilterEvent"
                    )
                }


                await message.delete().catch(() => null);
                break;
            }
        }
    }
};
