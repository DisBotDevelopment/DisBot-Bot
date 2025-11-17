import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, ChannelSelectMenuBuilder, ChannelType,
    Client,
    GuildMemberRoleManager, LabelBuilder,
    MessageFlags, ModalBuilder, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle,
    UserSelectMenuInteraction,
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-streaks-increase-type",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const value = interaction.values

        await database.levelSettings.update({
            where: {
                GuildId: interaction.guild.id
            },
            data: {
                XPStreaksIncreaseType: {
                    set: value
                }
            }
        })

        await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Updated your increase types.`, interaction, true, "reply")
    },
};
