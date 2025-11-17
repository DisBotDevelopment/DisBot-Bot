import {
    ActionRowBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-general-enabled",

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

        if (data.IsLevelModuleEnabled) {
            await database.levelSettings.update({
                where: {
                    GuildId: interaction.guild.id
                },
                data: {
                    IsLevelModuleEnabled: false
                }
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("toggleoff")} Disabled Level Module`, interaction, true, "reply")
        } else {
            await database.levelSettings.update({
                where: {
                    GuildId: interaction.guild.id
                },
                data: {
                    IsLevelModuleEnabled: true
                }
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("toggleon")} Enabled Level Module`, interaction, true, "reply")
        }

    }
};
