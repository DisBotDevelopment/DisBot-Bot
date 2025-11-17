import {
    ActionRowBuilder, ButtonBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder, RoleSelectMenuBuilder, StringSelectMenuInteraction, TextDisplayBuilder,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-roles-add-types",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: StringSelectMenuInteraction, client: ExtendedClient) {

        const role = interaction.customId.split(":")[1];
        const values = interaction.values

        const selected = ["level", "role", "not"].filter(v => values.includes(v));
        if (selected.length > 1) {
            return await sendDefaultMessage(
                `## ${await convertToEmojiToPng("error")} You can only select one of levelUp, next role, or notRemove.`,
                interaction,
                true,
                "reply"
            );
        }


        await database.levelRoles.update({
            where: {
                RoleId: role
            },
            data: {
                Types: {
                    set: values
                }
            }
        })

        await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Selected your Role Types Successfully.`, interaction, true, "reply")

    }
};
