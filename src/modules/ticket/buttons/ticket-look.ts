import {
    ButtonInteraction,
    ChannelType,
    ContainerBuilder,
    GuildMember,
    MessageFlags,
    PrivateThreadChannel, TextChannel,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {
    handleCloseAction,
    hasTicketPermission,
    ticketErrorMessage,
    ticketLookAction
} from "../../../helper/ticketHelper.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-lock",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        await ticketLookAction(
            interaction.channel as TextChannel | PrivateThreadChannel,
            client,
            interaction.customId.split(":")[1],
            null,
            interaction,
            null
        )
    },
};
