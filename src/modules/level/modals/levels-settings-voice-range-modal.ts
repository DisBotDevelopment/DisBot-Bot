import {
    ActionRowBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder, ModalSubmitInteraction,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";
import {NUM} from "undici/lib/llhttp/constants.js";

export default {
    id: "levels-settings-voice-range-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const minInput = parseInt(interaction.fields.getTextInputValue("min"))
            const maxInput = parseInt(interaction.fields.getTextInputValue("max"))

            if (isNaN(minInput) && isNaN(maxInput)) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Use valid numbers for the inputs.`, interaction, true, "reply")
            }

            if (minInput > maxInput) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Min Input is higher then the Max Inout!`, interaction, true, "reply")
            }

            await database.levelSettings.update({
                where: {
                    GuildId: interaction.guild.id
                },
                data: {
                    VoiceXPRange: `${minInput}-${maxInput}`
                }
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Updated the XP Range for Voice XP.`, interaction, true, "reply")


        } catch (e) {
            await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Please us valid numbers.`, interaction, true, "reply")
        }

    }
};
