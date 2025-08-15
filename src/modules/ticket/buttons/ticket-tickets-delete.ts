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
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-tickets-delete",

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
            return await ticketErrorMessage("No Ticket found!", interaction, client)
        }

        if (data.IsLocked) {
            return await ticketErrorMessage("Ticket is Locked!", interaction, client)
        }

        if (!data.IsClosed && !data.IsArchived) {
            return await ticketErrorMessage("This ticket is not deletable!", interaction, client)
        }


        await interaction.reply(
            {
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder()
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("ticket-tickets-delete-confirm:" + uuid)
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji("<:check:1320090167444377713>")
                                    .setLabel("Confirm"),
                                new ButtonBuilder()
                                    .setCustomId("ticket-tickets-delete-cancel:" + uuid)
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji("<:x_:1322169218682322955>")
                                    .setLabel("Cancel")
                            )
                        )
                ]
            }
        )


    },
};
