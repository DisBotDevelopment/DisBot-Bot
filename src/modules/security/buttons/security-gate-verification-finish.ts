import {ExtendedClient} from "../../../types/ExtendedClient.js";
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
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

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

        if (!data) return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Verification Gate not found`, interaction, true, "reply")

        if (!data.MessageId) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Verification Gate message not found`, interaction, true, "reply")
        }
        if (!data.ChannelId) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Verification Gate channel not found`, interaction, true, "reply")
        }
        if (!data.Action) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Verification Gate action not found`, interaction, true, "reply")
        }
        if (!data.ActionType) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Verification Gate action type not found`, interaction, true, "reply")
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

        return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Verification Gate finished`, interaction, true, "reply")
    }
};
