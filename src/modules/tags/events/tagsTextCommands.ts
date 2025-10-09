import {Events, Message} from "discord.js";
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

        if (!message.content.startsWith("!")) return

        const data = await database.tags.findFirst({
            where: {
                GuildId: message.guild?.id,
                TagId: message.content.split("!")[1].split(" ")[0]
            }
        });
        if (data) {
            try {
                if (message.author.id == client.user.id) return
                if (data.IsEnabled == false) return;
                if (data.PermissionRoleId) {
                    if (!client.user) new Error("Client user is not defined");

                    if (!message.member?.roles.cache.has(data.PermissionRoleId)) {
                        const msg = message.reply({
                            content: `## ${await convertToEmojiPng("tag", client.user?.id)} You do not have the permission to use this tag.`
                        });

                        setTimeout(async () => {
                            await message.delete();
                            await (await msg).delete();
                        }, 3000);
                        return;
                    }
                }

                const messageData = await database.messageTemplates.findFirst({
                    where: {
                        Name: data?.MessageTemplateId
                    }
                });

                if (!messageData) return;

                console.log(message.content.split("!")[1].split(" ")[1].replace("<", "").replace("@", "").replace(">", ""))

                let tag: string = undefined
                try {
                    const customMemberTag = await message.guild.members.fetch(
                        message.content
                            .split("!")[1]
                            .split(" ")[1]
                            .replace("<", "")
                            .replace("@", "")
                            .replace(">", "")
                    )
                    tag = `<@${customMemberTag.id}>`;
                } catch (e) {

                }

                if (messageData.EmbedJSON) {
                    await message.reply({
                        content: `${tag ? `-# ${tag}\n\n` : ""}` + (messageData.Content ?? ""),
                        embeds: [JSON.parse(messageData.EmbedJSON)]
                    });
                } else {
                    await message.reply({
                        content: `${tag ? `-# ${tag}\n\n` : ""}` + (messageData.Content ?? ""),
                    });
                }

                await message.delete()

            } catch (error) {

            }
        }
    }
};
