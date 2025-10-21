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
    id: "ticket-close-action-feedback-comment-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]
        const data = await database.tickets.findFirst({
            where: {
                TicketId: uuid
            }
        })

        if (!data) return await ticketErrorMessage("No Data!", interaction, client)

        let feedback = await database.ticketFeedback.findFirst({
            where: {
                TicketId: uuid
            }
        })
        if (!feedback) {
            await database.ticketFeedback.create(
                {
                    data: {
                        Sent: false,
                        SubmittedAt: new Date(),
                        Ticket: {
                            connect: {
                                TicketId: uuid
                            }
                        },
                        Comment: interaction.fields.getTextInputValue("comment") ?? "N/A"
                    }
                }
            )
            feedback = await database.ticketFeedback.findFirst({
                where: {
                    TicketId: uuid
                }
            })
        }

        console.log(interaction.fields.getTextInputValue("comment"))

        await database.ticketFeedback.update({
            where: {
                Id: feedback.Id
            },
            data: {
                SubmittedAt: new Date(),
                Comment: interaction.fields.getTextInputValue("comment") ?? "N/A"
            }
        })

        await interaction.deferUpdate()
    },
};
