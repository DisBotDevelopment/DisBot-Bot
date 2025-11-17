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
    id: "youtube-add-channelid",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();
        const channelname = new TextInputBuilder();

        modal
            .setTitle("Youtube Channel")
            .setCustomId("youtube-add-channelid-modal");

        channelname
            .setPlaceholder("Enter the Channel ID")
            .setCustomId("channelid")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.setLabelComponents(
            new LabelBuilder()
                .setLabel("Youtube Channel Id")
                .setDescription(`Youtube Channel Ids located at the Profile in the Description by the Share Channel and then Copy ID`)
                .setTextInputComponent(channelname)
        );

        await interaction.showModal(modal);

    }
};
