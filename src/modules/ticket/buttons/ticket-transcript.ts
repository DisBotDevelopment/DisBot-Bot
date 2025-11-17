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
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, ticketErrorMessage, ticketTranscriptBuilder} from "../../../helper/ticketHelper.js";
import {Converter} from "typedoc";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-transcript",

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
            return ticketErrorMessage("Ticket is Looked", interaction, client)
        }

        await ticketTranscriptBuilder(uuid, client, interaction.guild, interaction.channel as TextChannel | PrivateThreadChannel, null, interaction)
    },
};
