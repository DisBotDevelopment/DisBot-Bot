import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    ContainerBuilder,
    PrivateThreadChannel,
    TextChannel,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, ticketArchiveAction, ticketErrorMessage} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-archive",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        await ticketArchiveAction(
            interaction.channel as TextChannel | PrivateThreadChannel,
            client,
            interaction.customId.split(":")[1],
            null,
            interaction,
        )

        await interaction.deferUpdate();
    },
};
