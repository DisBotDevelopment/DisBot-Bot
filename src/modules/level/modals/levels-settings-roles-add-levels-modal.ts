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
    id: "levels-settings-roles-add-levels-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {

            const level = parseInt(interaction.fields.getTextInputValue("level"));
            const multiplier = parseInt(interaction.fields.getTextInputValue("multiplier"));
            if (isNaN(level) && isNaN(multiplier)) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} The input is invalid for the preset values.`, interaction, true, "reply")
            }

            await database.levelRoles.update({
                where: {
                    RoleId: interaction.customId.split(":")[1]
                },
                data: {
                    Level: level,
                    Multiplier: multiplier,
                }
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Updated Level Options for the Role <@&${interaction.customId.split(":")[1]}>`, interaction, true, "reply")

        } catch (e) {
            await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This is not a valid input!`, interaction, true, "reply")
        }

    }
};
