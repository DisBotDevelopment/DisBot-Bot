import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
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
        const modal = new ModalBuilder()
            .setCustomId("spotify-message-modal:" + uuid)
            .setTitle("Edit the Message Template")
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("messageTemplate")
                            .setLabel("Message Template ID")
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("Enter the Message Template ID")
                            .setRequired(true)
                    )
            );

        await interaction.showModal(modal);
    }
};
