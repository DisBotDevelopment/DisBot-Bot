import {ButtonInteraction, ChannelType, MessageFlags, TextChannel} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {ticketActionsHelper} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-actions",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {


        const data = await database.tickets.findFirst({
            where: {
                TicketId: interaction.customId.split(":")[1]
            }
        })
        if (!data) {
            await interaction.deferReply({
                flags: MessageFlags.Ephemeral,
            })
            return await interaction.editReply({
                content: `-# You only can use this in ticket Channels!`
            })


        }

        if (!data?.TicketId) {
            await interaction.deferReply({
                flags: MessageFlags.Ephemeral,
            })
            return await interaction.editReply({
                content: `-# No Ticket with the ID found!`
            })
        }

        await ticketActionsHelper(client, data.TicketId, interaction)
    }
};
