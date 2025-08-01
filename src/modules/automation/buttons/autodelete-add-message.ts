import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
    id: "autodelete-add-message",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not cached.");

        const uuid = interaction.customId.split(":")[1];

        const modal = new ModalBuilder()
            .setCustomId("autodelete-add-message-modal:" + uuid)
            .setTitle("Add Whitelisted Message to AutoDelete Setup");

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId("autodelete-add-message-input")
                        .setLabel("Enter the whitelisted message")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setPlaceholder("Type in the message ids separated by commas(,)")
                        .setMinLength(1)
                        .setMaxLength(2000)
                )
        );

        await interaction.showModal(modal);

    }
};
