import {ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-add-component-channel-name-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const openMessage = interaction.fields.getTextInputValue("message");

        const uuid = interaction.customId.split(":")[1];

        await database.ticketSetups.update(
            {
                where: {
                    GuildId: interaction.guild?.id,
                    CustomId: uuid
                },
                data: {
                    TicketChannelName: openMessage
                }
            }
        );

        await interaction.deferUpdate();
    }
};
