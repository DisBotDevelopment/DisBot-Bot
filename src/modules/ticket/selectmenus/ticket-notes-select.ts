import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder,
    ChannelType,
    Client, ContainerBuilder, GuildMember,
    MessageFlags,
    RoleSelectMenuBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-notes-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        for (const value of interaction.values) {
            if (value == "error") return await interaction.deferUpdate()

            const uuid = value.split(":")[1]
            const note = Number(value.split(":")[0])
            const data = await database.tickets.findFirst({
                where: {
                    TicketId: uuid
                }
            })

            const lookBypass = (await hasTicketPermission("look_bypass", interaction.member as GuildMember, data.TicketId, client) || await hasTicketPermission("all", interaction.member as GuildMember, data.TicketId, client))

            if (data.IsLocked && !lookBypass) return await ticketErrorMessage("Ticket is Locked", interaction, client)

            const notes = data.TicketNotes.filter((_, i) => i !== note);
            await database.tickets.update({
                where: {
                    TicketId: uuid
                },
                data: {
                    TicketNotes: {
                        set: notes
                    }
                }
            })

            await interaction.update({
                flags: MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(`Your not with the ID ${note + 1} has been removed successfully!`))
                ]
            })
        }
    }
}
