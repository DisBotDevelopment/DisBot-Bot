import {
    ButtonInteraction,
    ChannelType,
    ContainerBuilder, GuildMember,
    MessageFlags,
    PrivateThreadChannel,
    TextChannel,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-reopen",

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
            return await ticketErrorMessage("No Ticket found", interaction, client)
        }

        if (data.IsLocked && !(await hasTicketPermission("look_bypass", interaction.member as GuildMember, data.TicketId, client) || await hasTicketPermission("all", interaction.member as GuildMember, data.TicketId, client))) {
            return await ticketErrorMessage("Ticket is Locked", interaction, client)
        }

        if (!data.IsClosed && !data.IsArchived) {
            return await ticketErrorMessage("This ticket is not reopenable.", interaction, client)
        }

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        })

        let currentName = interaction.channel.name;
        let cleanedName = currentName.replace(/archived\s*/i, "");
        let parts = cleanedName.split("-");
        if (parts.length > 1) {
            let newName = parts.slice(1).join("-");
            await interaction.channel.setName(newName);
        }


        if (data.IsArchived) {
            const message = interaction.channel.messages.cache.get(data.ArchiveMessageId)
            if (message)
                await message.delete()
        }

        await database.tickets.update({
            where: {
                TicketId: uuid
            },
            data: {
                IsArchived: false,
                CloseActionReason: null,
                IsLocked: false,
                IsAutoDone: false,
                IsClosed: false,
                ArchiveMessageId: null
            }
        })

        if (data.ChannelType == ChannelType.PrivateThread) {

            await (interaction.channel as PrivateThreadChannel).setInvitable(false, "Moderator Action from Ticket with Id " + uuid)
            await (interaction.channel as PrivateThreadChannel).setLocked(false, "Moderator Action from Ticket with Id " + uuid)

        } else if (data.ChannelType == ChannelType.GuildCategory) {

            await (interaction.channel as TextChannel).permissionOverwrites.edit(data.TicketOwnerId, {
                SendMessages: true,
                ViewChannel: true
            })

            for (const memberId of data.AddedMemberIds) {
                await (interaction.channel as TextChannel).permissionOverwrites.edit(memberId, {
                    SendMessages: true,
                    ViewChannel: true
                })
            }

        }

        await interaction.channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`### ${await convertToEmojiPng("ticket", client.user.id)} Ticket has been reopened by ${interaction.user}`)
                    )
            ]
        })

        await interaction.editReply({
            content: `-# ${await convertToEmojiPng("ticket", client.user.id)} Ticket has beed re-opened!`
        })
    },
};
