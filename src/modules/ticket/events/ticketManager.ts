import {
    ActionRowBuilder, ButtonBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    Events,
    GuildChannel,
    GuildMember, GuildTextBasedChannel,
    Message,
    MessageFlags,
    ButtonStyle, ChannelType
} from "discord.js";
import {inviteTracker} from "../../../systems/inviteTracker/inviteTracker.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {hasTicketPermission, ticketHelper, ticketModalHelper} from "../../../helper/ticketHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    name: Events.MessageCreate,

    /**
     * @param {Message} message
     * @param {ExtendedClient} client
     */
    async execute(message: Message, client: ExtendedClient) {
        if (message.author.bot) return;
        if (message.channel.type == ChannelType.DM) return;

        const whereClause = message.hasThread
            ? {ThreadId: message.thread.id}
            : {ChannelId: message.channelId};

        const data = await database.tickets.findFirst({
            include: {
                TicketSetup: true
            },
            where: whereClause
        });
        if (!data) return


        await database.tickets.update({
            where: {
                TicketId: data.TicketId
            },
            data: {
                LastMessageId: message.id
            }
        })

        const claimBypass = (await hasTicketPermission("claim_bypass", message.member, data.TicketId, client) || await hasTicketPermission("all", message.member, data.TicketId, client))
        const lookBypass = (await hasTicketPermission("look_bypass", message.member, data.TicketId, client) || await hasTicketPermission("all", message.member, data.TicketId, client))

        if (data.IsLocked) {
            if (!lookBypass) {
                await message.delete()
            }
        }

        if (data.OnlyClaimMode) {
            if (!claimBypass && data.UserWhoHasClaimedId != message.author.id && data.TicketOwnerId != message.author.id) {
                await message.delete()
            }
        }

        if (data.AutoReplyMessageTemplateId && (data.TicketOwnerId == message.author.id || data.AddedMemberIds.includes(message.author.id))) {

            const ticketPlaceholderType = {
                member: {
                    name: message.member.user.username,
                    username: message.member.user.username,
                    tag: `<@${message.member.user.id}>`,
                    id: message.member.user.id,
                    displayName: message.member.user.displayName,
                    globalName: message.member.user.globalName,
                    avatar: message.member.displayAvatarURL()
                },
                ticket: {
                    id: data.TicketId,
                    isClosed: data.IsClosed,
                    isClaimed: data.IsClaimed,
                    autoCloseAfterInactivity: data.TicketSetup.AutoCloseAfterInactivity / 1000,
                    autoCloseAfterTime: data.TicketSetup.AutoCloseAfterTime / 1000,
                    userWhoHasClaimedId: data.UserWhoHasClaimedId,
                    userWhoHasClaimedTag: `<@${data.UserWhoHasClaimedId}>`,
                    userWhoHasClaimedName: message.guild.members.cache.get(data.UserWhoHasClaimedId).user.username,
                    isLocked: data.IsLocked,
                    isArchived: data.IsArchived,
                },
            }

            const messageData = await database.messageTemplates.findFirst({
                where: {
                    Name: data.AutoReplyMessageTemplateId
                }
            })

            if (messageData.EmbedJSON) {
                await message.reply({
                    content: messageData.Content ?? "",
                    embeds: [new EmbedBuilder(JSON.parse(messageData.EmbedJSON))]
                })
            } else {
                await message.reply({
                    content: messageData.Content ?? "",
                })
            }


        }

    }
}