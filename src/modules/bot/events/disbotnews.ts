import {Events, Message} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {Config} from "../../../main/config.js";

export default {
    name: Events.MessageCreate,

    async execute(message: Message, client: ExtendedClient) {

        const NEWS_CHANNELS = [
            Config.Modules.Bot.NewsChannel1,
            Config.Modules.Bot.NewsChannel2,
            Config.Modules.Bot.NewsChannel3,
            Config.Modules.Bot.NewsChannel4
        ];

        if (!NEWS_CHANNELS.includes(message.channel.id)) return;

        const TAGS = ["[#status]", "[#customer]", "[#updates]", "[#announcements]"];

        const data = await database.disBotUserNotifications.findMany();
        if (!data) return;

        data.forEach((element: any) => {
            const user = client.users.cache.get(element.UserID as string);

            if (TAGS.some((tag) => message.content.includes(tag))) {
                user?.send({content: message.content});
            } else {
                return;
            }
        });
    }
};
