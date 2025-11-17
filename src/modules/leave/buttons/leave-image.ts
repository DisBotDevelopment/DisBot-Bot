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
    id: "leave-image",

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

        modal.setTitle("Leave Image").setCustomId("leave-image-create");

        title
            .setLabel("Title")
            .setCustomId("leave-image-create-title")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("leave and hello to our server!")
            .setRequired(true);

        subtitle
            .setLabel("Subtitle")
            .setCustomId("leave-image-create-subtitle")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Join our community")
            .setRequired(true);

        text
            .setLabel("Text")
            .setCustomId("leave-image-create-text")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Read our Rules")
            .setRequired(true);

        color
            .setLabel("Color")
            .setCustomId("leave-image-create-color")
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
