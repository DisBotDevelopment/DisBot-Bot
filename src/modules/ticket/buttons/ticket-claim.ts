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
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, ticketErrorMessage, ticketTranscriptBuilder} from "../../../helper/ticketHelper.js";
import {Converter} from "typedoc";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-claim",

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

        if (data.IsLocked) {
            return ticketErrorMessage("Ticket is Looked", interaction, client)
        }

        if (data.IsClosed || data.IsArchived) {
            return ticketErrorMessage("Please Re-Open first", interaction, client)
        }

        if (data.IsClaimed && data.UserWhoHasClaimedId == interaction.user.id) {
            await database.tickets.update({
                where: {
                    TicketId: uuid
                },
                data: {
                    IsClaimed: false
                }
            })

            await interaction.channel.send({
                flags: MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(`### ${await convertToEmojiToPng("ticket")} ${interaction.user} has unclaimed the ticket waiting for a new Moderator!`)
                        )
                ]
            })

            await interaction.deferUpdate()
        } else {
            await database.tickets.update({
                where: {
                    TicketId: uuid
                },
                data: {
                    IsClaimed: true,
                    UserWhoHasClaimedId: interaction.user.id
                }
            })

            await interaction.channel.send({
                flags: MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(`### ${await convertToEmojiToPng("ticket")} ${interaction.user} has claimed the ticket! Please wait for a reply!`)
                        )
                ]
            })

            await interaction.deferUpdate()
        }
    },
};
