import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "welcome-image",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        
        const modal = new ModalBuilder();
        const channel = new TextInputBuilder();
        const title = new TextInputBuilder();
        const subtitle = new TextInputBuilder();
        const text = new TextInputBuilder();
        const color = new TextInputBuilder();

        modal.setTitle("Welcome Image").setCustomId("welcome-image-create");

        title
            .setLabel("Title")
            .setCustomId("welcome-image-create-title")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Welcome and hello to our server!")
            .setRequired(true);

        subtitle
            .setLabel("Subtitle")
            .setCustomId("welcome-image-create-subtitle")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Join our community")
            .setRequired(true);

        text
            .setLabel("Text")
            .setCustomId("welcome-image-create-text")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Read our Rules")
            .setRequired(true);

        color
            .setLabel("Color")
            .setCustomId("welcome-image-create-color")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("#ffffff")
            .setRequired(true);


        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(title),
            new ActionRowBuilder<TextInputBuilder>().addComponents(subtitle),
            new ActionRowBuilder<TextInputBuilder>().addComponents(text),
            new ActionRowBuilder<TextInputBuilder>().addComponents(color),
        );

        await interaction.showModal(modal);

    }
};
