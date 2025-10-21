import {
    ActionRowBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle, ContainerBuilder, GuildMember, MessageFlags, TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-infos",

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

        if (data.IsLocked) {
            return ticketErrorMessage("Ticket is Looked a Moderator need to unlock it!", interaction, client)
        }

        if (data.IsClosed) {
            return ticketErrorMessage("Ticket is Closed", interaction, client)
        }


        if (data.IsArchived) {
            return ticketErrorMessage("Ticket is already Archived!", interaction, client)
        }

        await interaction.update({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder()
                        .setContent(
                            [
                                `> ### ${await convertToEmojiToPng("ticket")} ${interaction.member} has canceled the close request from the ticket!`,
                            ].join("\n")))
            ]
        })


    },
};
