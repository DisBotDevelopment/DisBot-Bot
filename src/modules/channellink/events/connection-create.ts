import {Events, Message, WebhookClient} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";


export default {
    name: Events.MessageCreate,

    /**
     *
     * @param {Message} message
     * @param {ExtendedClient} client
     */
    async execute(message: Message, client: ExtendedClient) {

        const toggleData = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: message.guild?.id
            }
        });

        const data = await database.channelLinks.findMany();
        if (!toggleData) return;
        if (toggleData.ConnectionsEnabled == false) return;

        if (!data) return;

        if (message.webhookId) return;

        const condata = await database.channelLinks.findMany()
        for (const connected of condata) {
            if (connected.ChannelId != message.channel.id) continue;
            const guild = await client.guilds.fetch(connected.GuildId as string);
            const channel = await guild.channels.fetch(connected.ChannelId as string);
            const author = await client.users.fetch(message.author.id);
            const avatar = author.displayAvatarURL();
            const content = message.content;


            connected.WebhookUrls.forEach((webhookurl) => {
                const webhook = new WebhookClient({
                    url: webhookurl as string
                });

                webhook
                    .send({
                        content: content,
                        username: author.username,
                        avatarURL: avatar,
                        files:
                            message.attachments.size > 0
                                ? message.attachments.map((attachment) => attachment.url)
                                : undefined,
                        embeds: message.embeds ? message.embeds : undefined
                    })
                    .then(async (msg) => {
                        await database.syncedChannelLinkMessages.create({
                            data: {
                                UserMessageId: message.id,
                                WebhookMessageId: msg.id,
                                ChannelId: channel?.id,
                                GuildId: guild.id,
                                WebhookURL: webhookurl,
                                ChannelLinkId: connected.UUID
                            }
                        });
                    });

            })


        }
    }
};
