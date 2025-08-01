import { EmbedBuilder, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { IMAGE_PLACEHOLDER } from "../../../main/placeholder.js";

export default {
    id: "modal-embed-create-author-img",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const img = interaction.fields.getTextInputValue(
                "embed-create-options-author-img-input"
            );
            const message = await interaction.channel?.messages.fetch(
                interaction.customId.split(":")[1]
            );

            let imageUrl = img;
            for (const [key, value] of Object.entries(IMAGE_PLACEHOLDER)) {
                if (imageUrl.includes(key)) {
                    imageUrl = imageUrl.replace(key, value);
                }
            }

            const embed = message?.embeds[0];
            const updateembed = new EmbedBuilder(embed?.data).setAuthor({
                name: embed?.author?.name ? embed.author.name : "",
                iconURL: imageUrl,
                url: embed?.author?.url ? embed?.author?.url : undefined
            });

            message?.edit({ embeds: [updateembed] });
        } catch (error) {
            return interaction.reply({
                content:
                    "An error occurred while trying to set the image. - **Please set a Author First**",
                flags: MessageFlags.Ephemeral
            });
        }

        interaction.deferUpdate();
    }
};
