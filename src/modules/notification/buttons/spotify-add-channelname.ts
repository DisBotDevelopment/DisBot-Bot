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
    id: "spotify-add-channelname",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();
        const channelname = new TextInputBuilder();

        modal
            .setTitle("Spotify Show")
            .setCustomId("spotify-add-channelname-modal");

        channelname
            .setPlaceholder("Enter the show id")
            .setCustomId("channelName")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.setLabelComponents(
            new LabelBuilder()
                .setLabel("Spotify Show Id")
                .setDescription(`Show ID: https://open.spotify.com/show/%showId%?si=47132502ffab43a4`)
                .setTextInputComponent(channelname)
        );

        await interaction.showModal(modal);
    }
};
