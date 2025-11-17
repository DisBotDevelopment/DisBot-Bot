import {
    ActionRowBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle, ContainerBuilder,
    MessageFlags,
    ModalBuilder, TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {ticketErrorMessage} from "../../../helper/ticketHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-delete",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1];

        const data = await database.tickets.findFirst({
            where: {
                TicketId: uuid
            }
        })

        if (!data) {
            return ticketErrorMessage("No Ticket found", interaction, client)
        }

        if (data.IsLocked) {
            return ticketErrorMessage("Ticket is Looked", interaction, client)
        }

        if (!data.IsClosed) {
            return ticketErrorMessage("Ticket is not Closed!", interaction, client)
        }

        if (!data.IsArchived) {
            return ticketErrorMessage("The ticket is not Archived ", interaction, client)
        }

        if (data.AutoCloseAction.includes("confirm")) {
            if (Boolean(interaction.customId.split(":")[2])) {

            } else {
                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: "-# **You need to confirm your action**",
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-close-action-confirm:" + data.TicketId + ":" + "delete")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Confirm")
                                .setEmoji("<:check:1320090167444377713>")
                        )
                    ]
                })
            }
        }

        // Delete Code
        await database.tickets.delete({
            where: {
                TicketId: uuid
            }
        })

        await interaction.channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            [
                                `### ${await convertToEmojiToPng("trash")} All Ticket Data has been deleted! (Ticket Data)`,
                                `-# **Deleting Channel...**`
                            ].join("\n"))
                    )
            ]
        })
        
        await interaction.channel.delete()
    }
};
