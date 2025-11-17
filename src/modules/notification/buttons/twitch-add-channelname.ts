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
    id: "twitch-add-channelname",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();
        const channelname = new TextInputBuilder();

        modal
            .setTitle("Twitch Add Channel Name")
            .setCustomId("twitch-add-channelname-modal");

        channelname
            .setPlaceholder("Enter the channel name")
            .setCustomId("channelname")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.setLabelComponents(
            new LabelBuilder()
                .setLabel("Twitch Channel Name")
                .setDescription(`Channel name from https://twitch.tv/%name%`)
                .setTextInputComponent(channelname)
        );

        await interaction.showModal(modal);
    },
};
