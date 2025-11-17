import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder,
    ChannelType,
    Client, ContainerBuilder, GuildMember, GuildTextBasedChannel, MessageCreateOptions,
    MessageFlags, PrivateThreadChannel,
    RoleSelectMenuBuilder, SeparatorBuilder, SeparatorSpacingSize, TextChannel, TextDisplayBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {hasTicketPermission, ticketErrorMessage, ticketTranscriptBuilder} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-tickets-transcript-channel",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        for (const value of interaction.values) {
            if (value == "error") return await interaction.deferUpdate()

            const uuid = interaction.customId.split(":")[1]
            const data = await database.tickets.findFirst({
                include: {
                    TicketSetup: true
                },
                where: {
                    TicketId: uuid
                }
            })

            if (!data) {
                return await ticketErrorMessage("No Ticket found!", interaction, client)
            }

            let channel: PrivateThreadChannel | TextChannel
            if (data.ChannelType == ChannelType.GuildCategory) {

                channel = await interaction.guild.channels.fetch(data.ChannelId) as TextChannel
            } else if (data.ChannelType == ChannelType.PrivateThread) {

                const guildChannelCategory = await interaction.guild.channels.fetch(data.TicketSetup.CategoryId) as TextChannel
                channel = await guildChannelCategory.threads.fetch(data.ThreadId) as PrivateThreadChannel
            }

            const tr = await ticketTranscriptBuilder(
                uuid,
                client,
                interaction.guild,
                channel,
                null,
                null,
            )

            const trChannel = await interaction.guild.channels.fetch(value) as GuildTextBasedChannel

            await trChannel.send(tr as MessageCreateOptions)
            await interaction.deferUpdate()
        }
    }
}
