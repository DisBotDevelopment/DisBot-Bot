import {Events, Message, MessageFlags, TextChannel} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
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
        if (message.author.bot) return;
        if (!client.user) throw new Error("User is not logged in.");

        const data = await database.discordAddons.findFirst({
            where: {
                GuildId: message.guild?.id
            }
        })
        if (!data) return;
        if (data.NoLinkEmbeds.includes(message.channel.id)) {
            await message.edit({
                flags: MessageFlags.SuppressEmbeds
            })
        }
        if (data.OnlyMedia.includes(message.channel.id)) {

            if (message.attachments.size === 0 && message.embeds.length === 0) {
                await message.delete();
                const msg = await (message.channel as TextChannel).send({
                    content: `-# ${await convertToEmojiPng("image", client.user.id)} **OoO, in this channel you can only send media!**`,
                })
                setTimeout(async () => {
                    await msg.delete();
                }, 5000)
            }
        }

    }
};
