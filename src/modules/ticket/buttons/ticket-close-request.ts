import {
    ActionRowBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle, ContainerBuilder, GuildMember, MessageFlags, TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-close-request",

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

        await interaction.reply({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder()
                        .setContent(
                            [
                                `### ${await convertToEmojiPng("ticket", client.user.id)} ${interaction.user} ask to close this ticket from <@${data.TicketOwnerId}>`,
                                `> -# Claimed: ${data.IsClaimed ? "Yes" : "No"}`,
                                `> -# User Claimed:  ${data.UserWhoHasClaimedId ? `<@${data.UserWhoHasClaimedId}>` : "N/A"}`,
                            ].join("\n")))
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setEmoji("<:x_:1322169218682322955>")
                                .setDisabled(!(await hasTicketPermission("confirm-user-close", interaction.member as GuildMember, data.TicketId, client) || await hasTicketPermission("all", interaction.member as GuildMember, data.TicketId, client)))
                                .setCustomId("ticket-close:" + uuid)
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setEmoji("<:arrowbackregular24:1301119279088799815>")
                                .setCustomId("ticket-close-request-cancel")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    )
            ]
        })


    },
};
