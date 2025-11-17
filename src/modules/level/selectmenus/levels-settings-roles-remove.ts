import {
    ActionRowBuilder, ButtonBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder, RoleSelectMenuBuilder, RoleSelectMenuInteraction, StringSelectMenuInteraction, TextDisplayBuilder,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-roles-remove",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: RoleSelectMenuInteraction, client: ExtendedClient) {

        const values = interaction.values[0]

        await database.levelRoles.delete({
            where: {
                RoleId: values
            }
        })

        await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Deleted level role data successfully.`, interaction, true, "reply")

    }
};
