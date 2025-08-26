import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction, ContainerBuilder,
    InteractionContextType, MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ticketActionsHelper} from "../../../helper/ticketHelper.js";
import {database} from "../../../main/database.js";
import {Channel} from "diagnostics_channel";

export default {
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription(
            "Manage tickets and perform actions."
        )
        .setDescriptionLocalizations({
            de: "Verwalte tickets und führe aktionen aus.",
        })
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),

    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {

        const data = await database.tickets.findFirst({
            where: {
                ...(
                    interaction.channel.type == ChannelType.PrivateThread ? {ThreadId: interaction.channel.id} : {ChannelId: interaction.channel.id}
                )
            }
        })

        if (!data) {
            await interaction.deferReply({
                flags: MessageFlags.Ephemeral,
            })
            await interaction.editReply({
                content: `-# You only can use this in ticket Channels!`
            })

            setTimeout(() => interaction.deferReply({}), 2000)

        }
        await ticketActionsHelper(client, data.TicketId, interaction)

    }
};
