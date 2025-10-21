import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    MessageFlags,
    ModalSubmitInteraction,
    PermissionsBitField,
    TextChannel,
} from "discord.js";
import shortUUID from "short-uuid";
import {manageMessages, readMessageHistory, sendMessages, viewChannel,} from "../../../api/disbot-api.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {ticketErrorMessage, ticketHelper} from "../../../helper/ticketHelper.js";

export default {
    id: "notes-actions-add-note-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]

        const note = interaction.fields.getTextInputValue("note");

        const data = await database.tickets.findFirst({
            where: {
                TicketId: uuid
            }
        })

        if (!data) {
            await ticketErrorMessage("No Ticket", interaction, client);
        }

        await database.tickets.update({
            where: {
                TicketId: uuid
            },
            data: {
                TicketNotes: {
                    push: note
                }
            }
        })

        await interaction.deferUpdate()
    },
};
