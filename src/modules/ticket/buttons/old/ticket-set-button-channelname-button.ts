import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {database} from "../../../../main/database.js";

export default {
    id: "ticket-set-button-TicketChannelName-button",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();

        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: interaction.customId.split(":")[1]
            }
        });

        const openMessage = new TextInputBuilder();

        modal
            .setTitle("Setup a Channel Name")
            .setCustomId("ticketbutton-TicketChannelName");

        openMessage
            .setLabel("Channel Name")
            .setCustomId("message")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Enter the Channel Name")

            .setRequired(true);

        if (data && data.TicketChannelName) {
            openMessage.setValue(data.TicketChannelName);
        }

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(openMessage)
        );

        interaction.showModal(modal);
    }
};
