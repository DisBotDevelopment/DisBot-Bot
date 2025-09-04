import {
    ActionRowBuilder,
    AnySelectMenuInteraction,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {DisBotInteractionType} from "../../../enums/disBotInteractionType.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {getInteractionData} from "../../../helper/utilityHelper.js";

export default {
    id: "polls-disbot-options-show-select",
    type: DisBotInteractionType.SelectMenu,
    options: {
        once: false,
        permission: PermissionType.SecurityGate,
        cooldown: 3000, // 3 seconds
        botPermissions: [],
        userPermissions: [PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false
    },

    /**
     * @param {AnySelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: AnySelectMenuInteraction, client: ExtendedClient) {

        for (const value of interaction.values) {

            const uuid = getInteractionData(interaction, 1)

            const data = await database.polls.findFirst({
                where: {
                    UUID: uuid
                }
            })
            if (!data) {
                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiPng("error", client.user.id)} No Poll Data found!`
                })
            }


            await database.pollOptions.delete({
                where: {
                    UUID: value
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("check", client.user.id)} Removed Poll Option with ID ${value}`
            })
        }
    }
}

