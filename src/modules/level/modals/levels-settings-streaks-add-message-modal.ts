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
    id: "levels-settings-streaks-add-message-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const input = interaction.fields.getTextInputValue("input")

            const template = await database.messageTemplates.findFirst({
                where: {
                    Name: input
                }
            })
            if (!template) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No Message Template found`, interaction, true, "reply")
            }

            await database.xPStreaks.updateMany({
                where: {
                    Days: Number(interaction.customId.split(":")[1]),
                    GuildId: interaction.guild.id
                },
                data: {
                    MessageTemplateId: input
                }
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Updated the Message Template.`, interaction, true, "reply")


        } catch (e) {
            await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This is not a valid input!`, interaction, true, "reply")
        }

    }
};
