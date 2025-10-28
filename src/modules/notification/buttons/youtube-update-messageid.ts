import {
    ActionRowBuilder,
    ButtonInteraction,
    ChannelType, LabelBuilder,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "youtube-update-messageid",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const modal = new ModalBuilder()
        const messageId = new TextInputBuilder()

        messageId
            .setCustomId("messageId")
            .setPlaceholder("Message Template ID")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        modal.setCustomId("youtube-update-messageid-modal:" + interaction.customId.split(":")[1])
            .setTitle("Message Template")
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Message Template ID")
                    .setTextInputComponent(messageId)
            )

        await interaction.showModal(modal)

    }
};
