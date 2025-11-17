import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";

export default {
    id: "leave-image-create-button-setup",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();

        const background = new TextInputBuilder();
        const theme = new TextInputBuilder();
        const color = new TextInputBuilder();

        modal.setTitle("Create a Image").setCustomId("leave-image-create-setup");

        background
            .setLabel("Background")
            .setCustomId("leave-image-create-background")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("https://i.imgur.com/kjEQRRI.png")
            .setRequired(true);

        theme
            .setLabel("Theme")
            .setCustomId("leave-image-create-theme")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Use Dark, Circuit, Code")
            .setRequired(true);

        color
            .setLabel("Gradient Color")
            .setCustomId("leave-image-create-color")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Usage: #ffffff,#000000 - (Without the Space)")
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(background),
            new ActionRowBuilder<TextInputBuilder>().addComponents(theme),
            new ActionRowBuilder<TextInputBuilder>().addComponents(color),
        );

        await interaction.showModal(modal);
    }
};
