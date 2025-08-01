import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
    id: "autodelete-add-timer",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not cached.");

        const uuid = interaction.customId.split(":")[1];

        const modal = new ModalBuilder()
            .setCustomId("autodelete-add-timer-modal:" + uuid)
            .setTitle("Add Timer to AutoDelete Setup");

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId("autodelete-add-timer-input")
                        .setLabel("Enter the timer duration")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setPlaceholder("5m, 1h, etc.")
                        .setMinLength(1)
                        .setMaxLength(3)
                )
        );

        await interaction.showModal(modal);

    }
};
