import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "spotify-message-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user not found");
        const messageTemplate =
            interaction.fields.getTextInputValue("messageTemplate");
        const id = interaction.customId.split(":")[1];

        const message = await database.messageTemplates.findFirst({
            where: {
                Name: messageTemplate,
            }
        });

        if (!message) {
            await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Message Template not found with ID ${messageTemplate}`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        await database.spotifyNotifications.update(
            {
                where: {UUID: id},
                data: {
                    MessageTemplateId: messageTemplate,
                }
            }
        );

        await interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Message Template set to ${messageTemplate}`,
            flags: MessageFlags.Ephemeral,
        });
    },
};
