import { EmbedBuilder, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { IMAGE_PLACEHOLDER } from "../../../main/placeholder.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { cli } from "winston/lib/winston/config/index.js";

export default {
    id: "modal-embed-create-thumbnail",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const img = interaction.fields.getTextInputValue(
                "embed-create-options-thumbnail-thumbnail-input"
            );
            const message = await interaction.channel?.messages.fetch(
                interaction.customId.split(":")[1]
            );
            const embed = message?.embeds[0];

            let imgUrl = img;
            for (const [key, value] of Object.entries(IMAGE_PLACEHOLDER)) {
                if (imgUrl.includes(key)) {
                    imgUrl = imgUrl.replace(key, value)
                }
            }
            console.log(imgUrl);


            const updateembed = new EmbedBuilder(embed?.data).setThumbnail(
                imgUrl,
            );

            message?.edit({ embeds: [updateembed] });
        } catch (error) {
            if (!client.user) throw new Error("No Client")
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} An error occurred while trying to set the image.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        interaction.deferUpdate();
    },
};
