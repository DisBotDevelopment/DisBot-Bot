import {
    ActionRowBuilder,
    ButtonInteraction,
    ContainerBuilder,
    MessageFlags,
    ModalBuilder,
    TextChannel,
    TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, ticketErrorMessage} from "../../../helper/ticketHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-close-action-feedback-save",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const data = await database.tickets.findFirst({
            include: {
                TicketFeedback: true
            },
            where: {
                TicketId: interaction.customId.split(":")[1]
            }
        })

        if (!data) {
            return await ticketErrorMessage("No Data!", interaction, client)
        }

        if (!data.TicketFeedback) {
            return await ticketErrorMessage("No Feedback!", interaction, client)
        }

        if (data.TicketFeedback.Sent) {
            return await ticketErrorMessage("Feedback already sent!", interaction, client)
        }

        const guild = await client.guilds.fetch(data.GuildId)
        const channel = await guild.channels.fetch(data.TicketFeedbackChannelId)

        console.log(data.TicketFeedback.Comment)

        await (channel as TextChannel).send({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent([
                            `## ${await convertToEmojiToPng("star")} Feedback Result`,
                            ``,
                            `> **User**: ${interaction.user} (\`${interaction.user.id}\`)`,
                            `> **Ticket Id**: \`${data.TicketId}\``,
                            `> **Rating**: ${data.TicketFeedback.Rating == 1 ? "⭐" : data.TicketFeedback.Rating == 2 ? "⭐⭐" : data.TicketFeedback.Rating == 3 ? "⭐⭐⭐" : data.TicketFeedback.Rating == 4 ? "⭐⭐⭐⭐" : data.TicketFeedback.Rating == 5 ? "⭐⭐⭐⭐⭐" : "N/A"}`,
                            `> **Comment**: ${data.TicketFeedback.Comment ?? "N/A"}`,
                            `> **Sent At**: <t:${Math.floor(new Date(data.TicketFeedback.SubmittedAt).getTime() / 1000)}:R> (<t:${Math.floor(new Date(data.TicketFeedback.SubmittedAt).getTime() / 1000)}:F>)`,
                            ``
                        ].join("\n"))
                    )
            ]
        })

        await database.ticketFeedback.update({
            where: {
                TicketId: data.TicketId
            },
            data: {
                Sent: true
            }
        })

        await interaction.reply({
            content: `## ${await convertToEmojiToPng("star")} Your feedback has beed submitted to the Support Team!`
        })

    },
};
