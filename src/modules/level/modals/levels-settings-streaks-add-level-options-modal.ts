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
    id: "levels-settings-streaks-add-level-options-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const level = interaction.fields.getTextInputValue("level")
            const xp = interaction.fields.getTextInputValue("xp")
            const multiplier = interaction.fields.getTextInputValue("multiplier")

            await database.xPStreaks.updateMany({
                where: {
                    Days: Number(interaction.customId.split(":")[1]),
                    GuildId: interaction.guild.id
                },
                data: {
                    BonusLevels: parseInt(level),
                    BonusXP: parseInt(xp),
                    Multiplier: parseInt(multiplier)
                }
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Updated the Level Options for this streak.`, interaction, true, "reply")


        } catch (e) {
            await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This is not a valid input!`, interaction, true, "reply")
        }

    }
};
