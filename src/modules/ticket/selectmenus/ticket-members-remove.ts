import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder,
    ChannelType,
    Client, ContainerBuilder,
    MessageFlags, PrivateThreadChannel,
    RoleSelectMenuBuilder, SeparatorBuilder, SeparatorSpacingSize, TextChannel, TextDisplayBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ticketErrorMessage} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-members-remove",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        for (const value of interaction.values) {

            const uuid = interaction.customId.split(":")[1]
            const data = await database.tickets.findFirst({
                where: {
                    TicketId: uuid
                }
            })

            if (!data) {
                return await ticketErrorMessage("No Ticket", interaction, client)
            }

            if (!data.AddedMemberIds.includes(value)) {
                return await ticketErrorMessage("No Member-Add found!", interaction, client)
            }

            if (data.ChannelType == ChannelType.PrivateThread) {

                await (interaction.channel as PrivateThreadChannel).members.remove(value)

                return await interaction.update({
                    flags: MessageFlags.IsComponentsV2,
                    components: [
                        new ContainerBuilder()
                            .addTextDisplayComponents(new TextDisplayBuilder().setContent("Member has beed removed!"))
                    ]
                })

            } else if (data.ChannelType == ChannelType.GuildCategory) {
                await (interaction.channel as TextChannel).permissionOverwrites.delete(value)
                return await interaction.update({
                    flags: MessageFlags.IsComponentsV2,
                    components: [
                        new ContainerBuilder()
                            .addTextDisplayComponents(new TextDisplayBuilder().setContent("Member has beed deleted from channel!"))
                    ]
                })
            }
        }
    }
}
