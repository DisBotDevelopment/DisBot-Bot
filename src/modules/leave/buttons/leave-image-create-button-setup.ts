import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "leave-image-create-button-setup",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const message = await interaction.message.fetch();
        const modal = new ModalBuilder();

        const background = new TextInputBuilder();
        const theme = new TextInputBuilder();
        const color = new TextInputBuilder();
        const channel = new TextInputBuilder();

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
        channel
            .setLabel("Channel ID")
            .setCustomId("leave-message-create-channel")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("NOT CHANGE this value if you not know what you are doing")
            .setValue(`${message.content}`)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(background),
            new ActionRowBuilder<TextInputBuilder>().addComponents(theme),
            new ActionRowBuilder<TextInputBuilder>().addComponents(color),
            new ActionRowBuilder<TextInputBuilder>().addComponents(channel)
        );

        interaction.showModal(modal);
        await message.delete();
    }
};
