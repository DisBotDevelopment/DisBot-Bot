import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    ContainerBuilder, MessageFlags,
    PrivateThreadChannel,
    TextChannel,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, ticketErrorMessage} from "../../../helper/ticketHelper.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-close-action-confirm",

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
            return ticketErrorMessage("No Ticket found", interaction, client)
        }
        
        if (interaction.customId.split(":")[2] == "delete") {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: "-# **You need to confirm your action**",
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("ticket-delete:" + data.TicketId + ":" + "true")
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel("Confirm")
                            .setEmoji("<:check:1320090167444377713>")
                    )
                ]
            })
        }
        

        await handleCloseAction(
            client,
            interaction.guild,
            interaction.channel as TextChannel | PrivateThreadChannel,
            uuid,
            true,
            null,
            false,
            interaction
        )


    },
};
