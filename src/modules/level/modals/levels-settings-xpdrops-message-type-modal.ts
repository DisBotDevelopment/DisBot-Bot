import {
    ActionRowBuilder, BaseChannel, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ContainerBuilder, GuildChannel, LabelBuilder,
    MessageFlags,
    ModalBuilder, ModalSubmitInteraction,
    TextInputBuilder, TextInputStyle, VoiceChannel
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";
import {NUM} from "undici/lib/llhttp/constants.js";
import ms, {StringValue} from "ms";

export default {
    id: "levels-settings-xpdrops-message-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const input = interaction.fields.getTextInputValue("input")


            const messageTemplate = await database.messageTemplates.findFirst({
                where: {
                    Name: input
                }
            })

            if (!messageTemplate) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No Message Template Found.`, interaction, true, "reply")
            }


            await database.levelSettings.update({
                where: {
                    GuildId: interaction.guild.id
                },
                data: {
                    XPDropsMessageTemplate: input
                }
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Updated XP Drops Message Template.`, interaction, true, "reply")
        } catch (e) {
            await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This is not a valid input!`, interaction, true, "reply")
        }
    }
};
