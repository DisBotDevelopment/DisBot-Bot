import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "vanity-create",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder()
        const vanityInput = new TextInputBuilder()
        modal.setCustomId("vanity-create-modal").setTitle("Create Vanity URL")
        vanityInput.setCustomId("vanity").setLabel("Vanity URL").setStyle(1).setRequired(true).setMaxLength(20);
        modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(vanityInput))
        await interaction.showModal(modal)
    }
};
