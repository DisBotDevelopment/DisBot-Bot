import {ButtonStyle, Message, MessageFlags, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-embed-edit-save",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const message = (await interaction.channel?.messages.fetch(
            interaction.customId.split(":")[1]
        )) as unknown as Message;

        await database.messageTemplates.update(
            {
                where: {
                    Name: interaction.customId.split(":")[1]
                }
                ,
                data: {
                    EmbedJSON: JSON.stringify(message.embeds[0].data)
                }
            }
        );

        if (!client.user) throw new Error("Client not Found!");

        await interaction.message.delete();
        interaction
            .reply({
                content: `## ${await convertToEmojiPng(
                    "check",
                    client.user.id
                )} The embed has been saved.`,
                flags: MessageFlags.Ephemeral
            })
            .then(async (msg) => {
                setTimeout(async () => {
                    await msg.delete();
                }, 5000);
            });
    }
};
