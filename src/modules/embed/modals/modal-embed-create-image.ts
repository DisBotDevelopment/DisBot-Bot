import { EmbedBuilder, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { IMAGE_PLACEHOLDER } from "../../../main/placeholder.js";

export default {
    id: "modal-embed-create-image",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const img = interaction.fields.getTextInputValue(
                "embed-create-options-image-image-input"
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

            const updateembed = new EmbedBuilder(embed?.data).setImage(
                imgUrl,
            );

            message?.edit({ embeds: [updateembed] });
        } catch (error) {

            return interaction.reply({
                content: "An error occurred while trying to set the image.",
                flags: MessageFlags.Ephemeral,
            });
        }

        interaction.deferUpdate();
    },
};
