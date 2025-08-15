import {
    ButtonInteraction, PrivateThreadChannel, TextChannel,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, ticketErrorMessage} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-close",

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

        if (data.IsClosed) {
            return ticketErrorMessage("Ticket is Closed", interaction, client)
        }

        if (data.IsArchived) {
            return ticketErrorMessage("The ticket is Archived ", interaction, client)
        }

        await handleCloseAction(
            client,
            interaction.guild,
            interaction.channel as TextChannel | PrivateThreadChannel,
            uuid,
            null,
            null,
            false,
            interaction
        )
    },
};
