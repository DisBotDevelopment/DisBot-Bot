import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    TextInputStyle
} from "discord.js";
import {database} from "../../../main/database.js";

export default {
    id: "security-gate-verification-finish",

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
                content: `## ${await convertToEmojiToPng("error")} Verification Gate not found`,
                flags: MessageFlags.Ephemeral,
            });
        }

        if (!data.MessageId) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} Verification Gate message not found`,
                flags: MessageFlags.Ephemeral,
            });
        }
        if (!data.ChannelId) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} Verification Gate channel not found`,
                flags: MessageFlags.Ephemeral,
            });
        }
        if (!data.Action) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} Verification Gate action not found`,
                flags: MessageFlags.Ephemeral,
            });
        }
        if (!data.ActionType) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} Verification Gate action type not found`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await database.verificationGates.update(
            {
                where: {
                    UUID: uuid,
                },
                data: {
                    Active: true
                }
            }
        );

        return interaction.update({
            content: `## ${await convertToEmojiToPng("check")} Verification Gate finished`,
            components: [],
            embeds: []
        })
    }
};
