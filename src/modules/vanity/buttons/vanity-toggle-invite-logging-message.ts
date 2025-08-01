import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "vanity-toggle-invite-logging-message",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {


        const modal = new ModalBuilder()
        const value = new TextInputBuilder()

        modal.setCustomId("vanity-toggle-invite-logging-message-modal:" + interaction.customId.split(":")[1]).setTitle("Vanity Invite Logging Message");
        value.setCustomId("vanity-toggle-invite-logging-message-input")
            .setLabel("Message Template")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("Enter the message template for the invite logging (UUID)");

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(value)
        );
        await interaction.showModal(modal);
    }
};
