import {ChannelType, Client, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-add-component-feedback-channel",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const value of interaction.values) {


            await database.ticketSetups.update({
                where: {
                    CustomId: interaction.customId.split(":")[1]
                },
                data: {
                    WithTicketFeedback: true,
                    TicketFeedbackChannelId: value
                }
            })

            await interaction.deferUpdate();
        }
    }
};
