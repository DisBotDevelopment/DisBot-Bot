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
    id: "leave-message",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user not found");
        if (!interaction.guild) throw new Error("Guild not found");
        if (!interaction.member) throw new Error("Member not found");

        const modal = new ModalBuilder();

        const message = new TextInputBuilder();

        modal.setTitle("Message Template").setCustomId("leave-message-create");

        message
            .setLabel("Message Template ID")
            .setCustomId("leave-message-create-name")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);


        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(message),
        );

        await interaction.showModal(modal);

    }
};
