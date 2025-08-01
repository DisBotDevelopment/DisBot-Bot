import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export default {
    id: "security-gate-verification-captcha",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1];
        const code = interaction.customId.split(":")[2];

        const modal = new ModalBuilder()
            .setCustomId(`security-gate-verification-captcha-modal:${uuid}:${code}`)
            .setTitle("Captcha Verification");
        const input = new TextInputBuilder()
            .setCustomId("security-gate-verification-captcha-input")
            .setLabel("Please enter the captcha code:")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
        modal.addComponents(row);
        await interaction.showModal(modal);
    }
};
