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
    id: "security-gate-verification-reaction",

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

        if (data.ActionType != VerificationActionType.Reaction) return interaction.reply({
            content: `## ${await convertToEmojiPng("error", client.user.id)} This gate is already set to button you can't change it to reaction`,
            flags: MessageFlags.Ephemeral,
        });

        const modal = new ModalBuilder()
            .setCustomId("security-gate-verification-reaction-modal:" + interaction.customId.split(":")[1])
            .setTitle("Security Gate Verification");


        const emoji = new TextInputBuilder()
            .setCustomId("security-gate-verification-emoji-input")
            .setLabel("Emoji to use for verification")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("Use Win + . to open the emoji picker...");

        modal.addComponents
        (
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(emoji)
        )

        await interaction.showModal(modal);
    }
};
