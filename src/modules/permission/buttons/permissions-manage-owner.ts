import {ButtonInteraction, ChannelType, MessageFlags, StringSelectMenuBuilder, TextDisplayBuilder} from "discord.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {PaginationData} from "../../../types/Pagination.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "permissions-manage-owner",

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
            content: `## ${await convertToEmojiToPng("error")} No Data!`
        })

        if (data.NeedsGuildOwner) {
            await database.guildInteractionPermissions.update({
                where: {
                    UUID: interaction.customId.split(":")[1]
                },
                data: {
                    NeedsGuildOwner: false,
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("check")} This interaction not needs an Guild Owner`
            })

        } else {
            await database.guildInteractionPermissions.update({
                where: {
                    UUID: interaction.customId.split(":")[1]
                },
                data: {
                    NeedsGuildOwner: true,
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("check")} This interaction is needs the guild owner <@${interaction.guild.ownerId}>!`
            })

        }


    }
};
