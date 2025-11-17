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
import ms, {StringValue} from "ms";

export default {
    id: "levels-settings-general-firstxp-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const input = parseInt(interaction.fields.getTextInputValue("input"))

            if (isNaN(input)) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Please use a valid number.`, interaction, true, "reply")
            }

            await database.levelSettings.update({
                where: {
                    GuildId: interaction.guild.id
                },
                data: {
                    RequiredXPForFirstLevel: input
                }
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Updated first Required Level XP`, interaction, true, "reply")


        } catch (e) {
            await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This is not a valid input!`, interaction, true, "reply")
        }

    }
};
