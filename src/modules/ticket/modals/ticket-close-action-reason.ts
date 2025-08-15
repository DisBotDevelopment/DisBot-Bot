import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    MessageFlags,
    ModalSubmitInteraction,
    PermissionsBitField, PrivateThreadChannel,
    TextChannel,
} from "discord.js";
import shortUUID from "short-uuid";
import {manageMessages, readMessageHistory, sendMessages, viewChannel,} from "../../../api/disbot-api.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {handleCloseAction, ticketErrorMessage, ticketHelper} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-close-action-reason",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]
        const confirm = interaction.customId.split(":")[2]
        const data = await database.tickets.findFirst({
            where: {
                TicketId: uuid
            }
        })

        if (!data) return await ticketErrorMessage("No Data!", interaction, client)


        await handleCloseAction(
            client,
            interaction.guild,
            interaction.channel as TextChannel | PrivateThreadChannel,
            uuid,
            confirm ? Boolean(confirm) : null,
            interaction.fields.getTextInputValue("reason"),
            false,
            interaction
        )

    },
};
