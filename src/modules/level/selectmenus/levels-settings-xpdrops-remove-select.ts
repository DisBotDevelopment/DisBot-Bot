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
    id: "levels-settings-xpdrops-remove-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const value = interaction.values[0]

        try {
            await database.xPDrops.delete({
                where: {
                    UUID: value
                },
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Deleted your XP Drop ${value} successfully.`, interaction, true, "reply")

        } catch (e) {
            await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Regenerate the Pagination!`, interaction, true, "update")
        }
    },
};
