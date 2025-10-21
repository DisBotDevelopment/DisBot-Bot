import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, ChannelType,
    ContainerBuilder,
    GuildMember, GuildTextBasedChannel,
    MessageFlags, PermissionsBitField, SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize, StringSelectMenuBuilder, TextBasedChannel,
    TextDisplayBuilder, ThumbnailBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";
import {PaginationData} from "../../../types/pagination.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";

export default {
    id: "ticket-members-list",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]
        const data = await database.tickets.findFirst({
            where: {
                TicketId: uuid
            }
        })

        if (!data) {
            return ticketErrorMessage("No Ticket found", interaction, client)
        }

        if (data.IsLocked) {
            return ticketErrorMessage("Ticket is Looked", interaction, client)
        }

        // ADD MEMBERS (ADD/REMOVE) etc.

        await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiToPng("userdetail")} Member List`,
                                    ``,
                                    `${data.AddedMemberIds.map((m) => {
                                        const permissions = interaction.guild.members.cache.get(m).permissionsIn(interaction.channel).toArray()
                                        return `<@${m}>: \n-# ${permissions.join(",")} \n`
                                    }) ?? "-# Currently no members added"}`,
                                ].join("\n"))) 
            ]
        })
    }
}