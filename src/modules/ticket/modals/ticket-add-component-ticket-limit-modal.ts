import {ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-add-component-ticket-limit-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const limit = interaction.fields.getTextInputValue("limit");

        const uuid = interaction.customId.split(":")[1];

        await database.ticketSetups.update(
            {
                where: {
                    GuildId: interaction.guild?.id,
                    CustomId: uuid
                },
                data: {
                    TicketLimit: limit ? Number(limit) : null
                }
            }
        );

        await interaction.deferUpdate();
    }
};
