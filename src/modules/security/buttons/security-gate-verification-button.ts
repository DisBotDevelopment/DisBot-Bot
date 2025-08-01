import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
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
import {VerificationActionType} from "../../../enums/verification.js";
import {database} from "../../../main/database.js";

export default {
    id: "security-gate-verification-button",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        if (!client.user) throw new Error("User does not exist");

        const uuid = interaction.customId.split(":")[1];
        const data = await database.verificationGates.findFirst({
            where: {
                UUID: uuid
            }
        });


        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} Verification Gate not found`,
                flags: MessageFlags.Ephemeral,
            });
        }

        if (data.ActionType == VerificationActionType.Reaction) return interaction.reply({
            content: `## ${await convertToEmojiPng("error", client.user.id)} This gate is already set to reaction you can't change it to button`,
            flags: MessageFlags.Ephemeral,
        });

        const modal = new ModalBuilder()
            .setCustomId("security-gate-verification-button-modal:" + interaction.customId.split(":")[1])
            .setTitle("Security Gate Verification");

        const label = new TextInputBuilder()
            .setCustomId("security-gate-verification-button-label")
            .setLabel("Verification Button Label")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const emoji = new TextInputBuilder()
            .setCustomId("security-gate-verification-button-emoji")
            .setLabel("Verification Button Emoji")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)

        const style = new TextInputBuilder()
            .setCustomId("security-gate-verification-button-style")
            .setLabel("Verification Button Style")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("PRIMARY, SECONDARY, SUCCESS, DANGER, LINK (Required if you use Authorize)");

        modal.addComponents
        (
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(label),
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(emoji),
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(style)
        )

        await interaction.showModal(modal);
    }
};
