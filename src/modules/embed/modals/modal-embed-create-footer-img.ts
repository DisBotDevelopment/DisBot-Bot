import { Client, EmbedBuilder, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { IMAGE_PLACEHOLDER } from "../../../main/placeholder.js";

export default {
    id: "modal-embed-create-footer-img",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const img = interaction.fields.getTextInputValue(
                "embed-create-options-footer-img-input"
            );
            const message = await interaction.channel?.messages.fetch(
                interaction.customId.split(":")[1]
            );

            console.log(message);


            const embed = message?.embeds[0];

            let imgURL = img;
            for (const [key, value] of Object.entries(IMAGE_PLACEHOLDER)) {
                if (img.includes(key)) {
                    imgURL = img.replace(key, value);
                }
            }



            const updateembed = new EmbedBuilder(embed?.data).setFooter({
                text: embed?.data.footer?.text ? embed?.data.footer?.text : '',
                iconURL: imgURL,
            });

            message?.edit({ embeds: [updateembed] });
        } catch (error) {
            if (!client.user) throw new Error("No Client")
            return interaction.reply({
                content: ` ## ${await convertToEmojiPng("error", client.user?.id)}An error occurred while trying to set the image. - **Please set a Footer First**`,
                flags: MessageFlags.Ephemeral,
            });
        }

        interaction.deferUpdate();
    },
};
