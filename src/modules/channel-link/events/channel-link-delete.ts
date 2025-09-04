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

        const syncedLinks = await database.syncedChannelLinkMessages.findMany({
            where: {
                UserMessageId: oldMessage.id
            }
        });

        if (!syncedLinks) return;

        for (const data of syncedLinks) {
            const webhook = new WebhookClient({
                url: data.WebhookUrl as string
            });

            if (!webhook) continue;

            await webhook.deleteMessage(
                data.WebhookMessageId
            );
        }
    }
};
