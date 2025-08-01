import {Events, Message, WebhookClient} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";



export default {
    name: Events.MessageDelete,

    /**
     *
     * @param {Message} oldMessage
     * @param {Message} newMessage
     * @param {ExtendedClient} client
     */
    async execute(
        oldMessage: Message,
        newMessage: Message,
        client: ExtendedClient
    ) {

        const data = await database.channelLinks.findMany();

        const toggledata = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: oldMessage.guild?.id
            }
        });

        if (!toggledata) return;
        if (toggledata.ConnectionsEnabled == false) return;

        if (!data) return;
        if (!data) return;


        for (const connected of data) {
            if (connected.ChannelId != oldMessage.channel.id) continue;

            for (const url of connected.WebhookUrls) {
                const webhook = new WebhookClient({
                    url: url
                });

                const connectionmsgdata = await database.syncedChannelLinkMessages.findFirst({
                    where: {
                        UserMessageId: oldMessage.id
                    }
                });
                await webhook.deleteMessage(
                    connectionmsgdata?.WebhookMessageId as string
                );
            }

        }
    }
};
