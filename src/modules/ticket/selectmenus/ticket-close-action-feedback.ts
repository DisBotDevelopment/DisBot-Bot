import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    Client,
    EmbedBuilder,
    MessageFlags,
    ModalBuilder,
    PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuInteraction,
    TextChannel,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuInteraction,
} from "discord.js";
import shortUUID from "short-uuid";
import {manageMessages, readMessageHistory, sendMessages, viewChannel,} from "../../../api/disbot-api.js";
import {convertToEmojiPng} from "../../../helper/emojis.js"
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {ticketErrorMessage, ticketHelper, ticketModalHelper} from "../../../helper/ticketHelper.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "ticket-close-action-feedback",

    /**
     * @param {StringSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: StringSelectMenuInteraction, client: ExtendedClient) {
        try {
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
                            Rating: interaction.values.includes("one") ? 1 : interaction.values.includes("two") ? 2 : interaction.values.includes("three") ? 3 : interaction.values.includes("four") ? 4 : interaction.values.includes("five") ? 5 : 0
                        }
                    }
                )
                feedback = await database.ticketFeedback.findFirst({
                    where: {
                        TicketId: uuid
                    }
                })
            }

            await database.ticketFeedback.update({
                where: {
                    id: feedback.id
                },
                data: {
                    SubmittedAt: new Date(),
                    Rating: interaction.values.includes("one") ? 1 : interaction.values.includes("two") ? 2 : interaction.values.includes("three") ? 3 : interaction.values.includes("four") ? 4 : interaction.values.includes("five") ? 5 : 0
                }
            })

            await interaction.deferUpdate()
        } catch (error) {
            console.log(error)
            return await ticketErrorMessage("Please try again - We can't get your Feedback", interaction, client)
        }
    },
};
