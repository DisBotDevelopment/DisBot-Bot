import {ButtonInteraction, ChannelType, MessageFlags, StringSelectMenuBuilder, TextDisplayBuilder} from "discord.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {ExtendedClient} from "../../../types/client.js";
import {PaginationData} from "../../../types/pagination.js";
import {database} from "../../../main/database.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    id: "permissions-manage-user-permission",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const data = await database.guildInteractionPermissions.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        })

        if (!data) return await interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: `## ${await convertToEmojiPng("error", client.user.id)} No Data!`
        })

        if (data.DisableInternalUserPermission) {
            await database.guildInteractionPermissions.update({
                where: {
                    UUID: interaction.customId.split(":")[1]
                },
                data: {
                    DisableInternalUserPermission: false,
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("check", client.user.id)} This interaction is now resection the internal user permission!`
            })

        } else {
            await database.guildInteractionPermissions.update({
                where: {
                    UUID: interaction.customId.split(":")[1]
                },
                data: {
                    DisableInternalUserPermission: true,
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("check", client.user.id)} This interaction is now ignoring the internal user permission!`
            })

        }

    }
};
