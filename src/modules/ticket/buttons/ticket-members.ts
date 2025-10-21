import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, ChannelType,
    ContainerBuilder,
    GuildMember,
    MessageFlags, PermissionsBitField, SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder, ThumbnailBuilder, UserSelectMenuBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-members",

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
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent("Add/Remove members from the ticket and manage them."))
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-members-list:" + uuid)
                                .setEmoji("<:list:1404137033496002591>")
                                .setLabel("List Members")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(data.ChannelType == ChannelType.PrivateThread)
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId("ticket-members-add:" + uuid)
                                .setPlaceholder("Add a member to the ticket")
                                .setDisabled(data.ChannelType == ChannelType.PrivateThread && !(await hasTicketPermission("add_member_to_ticket", interaction.member as GuildMember, data.TicketId, client) || await hasTicketPermission("all", interaction.member as GuildMember, data.TicketId, client)))
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId("ticket-members-remove:" + uuid)
                                .setPlaceholder("Remove a member from the ticket")
                                .setDisabled(data.ChannelType == ChannelType.PrivateThread && !(await hasTicketPermission("remove_user_from_ticket", interaction.member as GuildMember, data.TicketId, client) || await hasTicketPermission("all", interaction.member as GuildMember, data.TicketId, client)))
                        )
                    )
            ]
        })
    },
};
