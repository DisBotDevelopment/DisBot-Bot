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
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "security-gate-verification-deactivate",

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

        if (!data) return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Verification Gate not found`, interaction, true, "reply")

        await database.verificationGates.update(
            {
                where: {
                    UUID: data.UUID
                },
                data: {
                    Active: false
                }
            }
        );

        return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Verification Gate deactivated successfully`, interaction, true, "reply")
    }
};
