import {
    ActionRowBuilder,
    ButtonInteraction,
    ChannelType,
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

        modal.setCustomId("youtube-update-messageid-modal:" + interaction.customId.split(":")[1])
            .setTitle("Update Message ID")
            .setComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(
                    messageId
                        .setCustomId("messageId")
                        .setLabel("Message ID")
                        .setPlaceholder("Enter the message ID")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                )
            );
        interaction.showModal(modal)

    }
};
