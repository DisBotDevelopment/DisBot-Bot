import {Events, Message} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    /**
     * @param {Message} message
     * @param {ExtendedClient} client
     */

    async execute(message: Message, client: ExtendedClient) {
        const eventChannelId = message.channel.id;

        const toggledata = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: message.guild?.id
            }
        });

        if (!toggledata) return;
        if (toggledata.AutoreactEnabled == false) return;

        const data = await database.autoReacts.findMany({
            where: {
                GuildId: message.guild?.id
            }
        });

        if (!data) return;

        if (data.length <= 0) return;

        const autodata = await database.autoReacts.findMany({
            where: {
                GuildId: message.guildId
            }
        })
        for (const eventData of autodata) {
            if (eventChannelId != eventData.ChannelId) continue;
            await message.react(eventData.Emoji ? eventData.Emoji : "👍");
        }
    },

    name: Events.MessageCreate
};
