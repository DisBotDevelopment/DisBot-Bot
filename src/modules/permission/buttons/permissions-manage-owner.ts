import {ButtonInteraction, ChannelType, MessageFlags, StringSelectMenuBuilder, TextDisplayBuilder} from "discord.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {ExtendedClient} from "../../../types/client.js";
import {PaginationData} from "../../../types/pagination.js";
import {database} from "../../../main/database.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

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
            content: `## ${await convertToEmojiPng("error", client.user.id)} No Data!`
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
                content: `## ${await convertToEmojiPng("check", client.user.id)} This interaction not needs an Guild Owner`
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
                content: `## ${await convertToEmojiPng("check", client.user.id)} This interaction is needs the guild owner <@${interaction.guild.ownerId}>!`
            })

        }


    }
};
