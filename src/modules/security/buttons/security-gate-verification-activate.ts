import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {uuid} from "short-uuid";

export default {
    id: "security-gate-verification-activate",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("User is not logged in.");

        const data = await database.verificationGates.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });


        if (!data) return interaction.reply({
            content: `## ${await convertToEmojiPng("error", client.user?.id)} Verification Gate not found`,
            flags: MessageFlags.Ephemeral
        });

        await database.verificationGates.update(
            {
                where: {
                    UUID: data.UUID
                },
                data: {
                    Active: true
                }
            }
        );

        return interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Verification Gate activated successfully`,
            flags: MessageFlags.Ephemeral
        });

    }
};
