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
  id: "spotify-add-channelname",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client User is not defined");

        const modal = new ModalBuilder()
            .setCustomId("spotify-add-channelname-modal")
            .setTitle("Add a Spotify Channel Name");

        const channelNameInput = new TextInputBuilder()
            .setCustomId("channelName")
            .setLabel("Enter the Spotify Channel Name")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Spotify Channel Name")
            .setRequired(true)
            .setMaxLength(100);

        const channelNameRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
            channelNameInput
        );

        modal.addComponents(channelNameRow);

        await interaction.showModal(modal);
    }
};
