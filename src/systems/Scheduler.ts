import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, ChannelType,
    ContainerBuilder,
    FileBuilder,
    MessageFlags, PrivateThreadChannel,
    StringSelectMenuBuilder, TextChannel
} from "discord.js";
import {ExtendedClient} from "../types/client.js";
import {database} from "../main/database.js";
import {handleCloseAction} from "../helper/ticketHelper.js";
import {Config} from "../main/config.js";

export class Scheduler {

    public static async checkVoteRoles(client: ExtendedClient) {
        const voteGuild = await client.guilds.fetch(Config.Other.Vote.VoteGuildId)

        const members = await voteGuild.members.fetch()
        for (const member of members.values()) {
            const dbUser = await database.users.findFirst({
                where: {
                    UserId: member.user.id
                }
            })

            if (!dbUser) {
                continue
            }
            if (!dbUser.LastVote) {
                continue
            }
            const now = Date.now();
            if (dbUser.LastVote.getTime() + 24 * 60 * 60 * 1000 < now) {
                await member.roles.remove(Config.Other.Vote.VoteRoleId);
            }
        }
    }

    public static async checkLast30DaysVanities(client: ExtendedClient) {
        const vanities = await database.vanitys.findMany({
            include: {
                Analytics: {
                    include: {
                        Latest30Days: true
                    }
                }
            }
        });

        for (const value of vanities) {
            const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;

            const needsReset = !value.Analytics?.Latest30Days?.Date ||
                new Date().getTime() - new Date(value.Analytics.Latest30Days.Date).getTime() > THIRTY_DAYS_MS;

            if (needsReset) {
                await database.vanityAnalyticsLatest30Day.updateMany({
                    where: {
                        VanityAnalyticsId: value.UUID
                    },
                    data: {
                        Click: 0,
                        UniqueClick: 0,
                        Date: new Date(),
                        JoinedWithCode: 0,
                    }
                })
            }
        }
    }

    public static async deleteMessagesFromAutoDelete(client: ExtendedClient) {
        const autoDeletes = await database.guildAutoDeletes.findMany()

        for (const data of autoDeletes) {

            const channel = await client.channels.fetch(data.ChannelId as string).catch(() => null);
            if (!channel || !channel.isTextBased()) continue;

            for (const msgId of channel.messages.cache.keys()) {
                const msg = await channel.messages.fetch(msgId).catch(() => null);
                if (!msg) continue;
                const whitelistedMessages = data.WhitelistedMessages;
                const whitelistedUsers = data.WhitelistedUsers;
                const whitelistedRoles = data.WhitelistedRoles;


                if (
                    whitelistedMessages.includes(msg.id) ||
                    whitelistedUsers.includes(msg.author.id) ||
                    msg.member?.roles.cache.some(role => whitelistedRoles.includes(role.id))
                ) {
                    continue;
                }

                await msg.delete().catch(() => {
                });
            }
        }
    }

    public static async scheduleTicketsDeleteAfterTimeAndInactivity(client: ExtendedClient) {

        const ticketData = await database.tickets.findMany({
            include: {
                TicketSetup: true
            }
        })
        if (!ticketData) return;

        for (const ticket of ticketData) {

            if (ticket.IsAutoDone) continue;

            const guild = await client.guilds.fetch(ticket.GuildId)
            if (!guild) continue;
            let channel: TextChannel | PrivateThreadChannel
            if (ticket.ChannelType == ChannelType.GuildCategory) {
                try {
                    channel = await guild.channels.fetch(ticket.ChannelId) as TextChannel
                } catch (e) {
                    continue;
                }
            } else if (ticket.ChannelType == ChannelType.PrivateThread) {
                try {
                    const threadChannel = await guild.channels.fetch(ticket.TicketSetup.CategoryId) as TextChannel
                    channel = await threadChannel.threads.fetch(ticket.ThreadId) as PrivateThreadChannel
                } catch (e) {
                    continue;
                }
            }

            if (ticket.TicketSetup.AutoCloseAfterInactivity) {
                if (!ticket.LastMessageId) continue;
                let latestMessage = null;
                try {
                    latestMessage = await channel.messages.fetch(ticket.LastMessageId);
                } catch (err) {
                    continue
                }
                const inactivityTime = ticket.TicketSetup.AutoCloseAfterInactivity; // MS TIME

                if (latestMessage && latestMessage.createdAt instanceof Date) {
                    const time = latestMessage.createdAt.getTime();
                    const now = Date.now();

                    const inactiveFor = now - time;

                    if (inactiveFor >= inactivityTime) {
                        await handleCloseAction(
                            client,
                            guild,
                            channel,
                            ticket.TicketId,
                            null,
                            "Ticket Inactive",
                            true,
                        )
                    }
                }
            }

            if (ticket.TicketSetup.AutoCloseAfterTime) {
                if (!ticket.LastMessageId) continue;
                let latestMessage = null;
                try {
                    latestMessage = await channel.messages.fetch(ticket.LastMessageId);
                } catch (err) {
                    continue
                }
                const autoCloseTime = ticket.TicketSetup.AutoCloseAfterTime; // MS TIME

                if (latestMessage) {
                    const time = ticket.CreatedAt.getTime()
                    const now = Date.now();

                    const inactiveFor = now - time;

                    if (inactiveFor >= autoCloseTime) {
                        await handleCloseAction(
                            client,
                            guild,
                            channel,
                            ticket.TicketId,
                            null,
                            "Ticket is too long open!",
                            true,
                        )
                    }
                }
            }
        }
    }
}