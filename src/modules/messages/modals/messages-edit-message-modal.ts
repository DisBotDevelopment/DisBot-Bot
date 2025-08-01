import {MessageFlags, ModalSubmitInteraction,} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-edit-message-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const data = await database.messageTemplates.findFirst({
            where: {
                Name: interaction.customId.split(":")[1],
            }
        });

        const uuid = data?.Name;

        if (
            !interaction.fields.getTextInputValue("content") &&
            data?.EmbedJSON == null
        ) {
            if (!client.user) throw new Error("Client not Found!");
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} You can not remove the content of a message if it has no embed`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await database.messageTemplates.update(
            {
                where: {
                    Name: uuid
                },
                data: {
                    Content: interaction.fields.getTextInputValue("content")
                        ? interaction.fields.getTextInputValue("content")
                        : null,
                }
            }
        );

        if (!client.user) throw new Error("Client not Found!");
        interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Message updated and saved successfully `,
            flags: MessageFlags.Ephemeral,
        });
    },
};
