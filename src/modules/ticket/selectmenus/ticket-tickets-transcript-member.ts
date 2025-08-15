import {
    ButtonStyle,
    ChannelType,
    Client, MessageCreateOptions,
    MessageFlags,
    PrivateThreadChannel,
    SeparatorSpacingSize,
    TextChannel,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {ticketErrorMessage, ticketTranscriptBuilder} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-tickets-transcript-member",

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

            const member = await interaction.guild.members.fetch(value)
            await member.createDM(true)

            await member.send(tr as MessageCreateOptions)
            await interaction.deferUpdate()
        }
    }
}
