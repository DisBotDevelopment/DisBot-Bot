import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle, LabelBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "spotify-message",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];

        const modal = new ModalBuilder();
        const messageID = new TextInputBuilder();

        modal
            .setTitle("Message Template")
            .setCustomId(
                "spotify-message-modal:" + interaction.customId.split(":")[1]
            );

        messageID
            .setCustomId("messageTemplate")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Message Template ID")
                    .setTextInputComponent(messageID)
            );

        await interaction.showModal(modal);
    }
};
