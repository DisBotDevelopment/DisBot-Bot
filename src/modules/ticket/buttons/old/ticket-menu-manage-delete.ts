import {ButtonInteraction, ButtonStyle, ChannelType, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {database} from "../../../../main/database.js";

export default {
    id: "ticket-menu-manage-delete",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: interaction.customId.split(":")[1]
            }
        });

        if (!data) {
            return interaction.reply({
                content: "No Ticket Button Found",
                flags: MessageFlags.Ephemeral
            });
        }

        await database.ticketSetups.delete({
            where: {
                CustomId: interaction.customId.split(":")[1]
            }
        });

        interaction.reply({
            content: "## Your Ticket Selcetmenu Setup has been deleted",
            flags: MessageFlags.Ephemeral
        });
    }
};
