import {
    ActionRowBuilder, AttachmentBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle, ChannelSelectMenuBuilder,
    ChannelType,
    ContainerBuilder, FileBuilder, GuildMember,
    MessageFlags,
    PrivateThreadChannel,
    TextChannel,
    TextDisplayBuilder, UserSelectMenuBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-tickets-delete-confirm",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1]
        await database.tickets.delete({
            where: {
                TicketId: uuid
            }
        })

        await interaction.update({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`> ${await convertToEmojiToPng("check")} Successfully Deleted your Ticket (${uuid})\n> -# Your Ticket-Channel can be deleted if not\n> -# All Data to this ticket are fully deleted!`)
                    )
            ]
        })
    },
};
