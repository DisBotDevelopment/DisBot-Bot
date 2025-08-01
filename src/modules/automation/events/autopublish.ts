import {Events, Message, TextChannel} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    /**
     * @param {Message} message
     * @param {ExtendedClient} client
     */
    async execute(message: Message, client: ExtendedClient) {
        const eventchannel = message.channel.id;

        const toggledata = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: message.guild?.id
            }
        });

        if (!toggledata) return;
        if (toggledata.AutopublishEnabled == false) return;

        const data = await database.autoPublish.findFirst({
            where: {
                GuildId: message.guild?.id
            }
        });

        if (!data) return;

        if (!data.Channels.length) return;

        for (const channelId of data.Channels) {
            const channel = message.guild?.channels.cache.get(
                channelId
            ) as TextChannel;

            if (eventchannel != channelId) continue;

            const publishMessage = await channel.messages.fetch(message.id);

            await publishMessage.crosspost();
        }
    },

    name: Events.MessageCreate
};
