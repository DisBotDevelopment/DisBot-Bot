import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "security-gate-verification-delete",

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

        await database.verificationGates.delete
        ({
            where: {
                UUID: data.UUID
            }
        });
        
        return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Verification Gate deleted successfully`, interaction, true, "reply")
    }
};
