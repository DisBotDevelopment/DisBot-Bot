import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle, LabelBuilder,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";

export default {
    id: "security-gate-verification-create",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("User is not logged in.");
        const modal = new ModalBuilder()
        const messageURL = new TextInputBuilder()
        modal.setTitle("Security Gate Verification Creation")
            .setCustomId("security-gate-verification-create-modal");


        messageURL
            .setCustomId("security-gate-verification-create-message-url")
            .setPlaceholder("https://discord.com/channels/123456789012345678/123456789012345678/123456789012345678")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);


        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Message URL")
                    .setDescription("Embed Message or leave it blank if you want to use Components V2 Messages")
                    .setTextInputComponent(messageURL)
            )

        await interaction.showModal(modal);
    }
};
