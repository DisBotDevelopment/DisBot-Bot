import {
    ActionRowBuilder,
    ButtonInteraction,
    LabelBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";

export default {
    id: "twitch-add-message",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();
        const messageID = new TextInputBuilder();

        modal
            .setTitle("Message Template")
            .setCustomId(
                "twitch-add-message-modal:" + interaction.customId.split(":")[1]
            );

        messageID
            .setCustomId("twitch-add-message-id")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Message Template ID")
                    .setTextInputComponent(messageID)
            );

        await interaction.showModal(modal);
    },
};
