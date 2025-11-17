import {
    ActionRowBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-voice-messagexp",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const data = await database.levelSettings.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        })

        if (data.IsVoiceXPEnabled) {

            await database.levelSettings.update({
                where: {
                    GuildId: interaction.guild.id
                },
                data: {
                    IsVoiceXPEnabled: false
                }
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("toggleoff")} Disabled your Voice Leveling`, interaction, true, "reply")
        } else {

            await database.levelSettings.update({
                where: {
                    GuildId: interaction.guild.id
                },
                data: {
                    IsVoiceXPEnabled: true
                }
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("toggleon")} Enabled your Voice Leveling`, interaction, true, "reply")
        }
    }
};
