import {database} from "../main/database.js";
import {
    ActionRowBuilder,
    AnySelectMenuInteraction, AttachmentBuilder,
    BitField, ButtonBuilder,
    ButtonInteraction, ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction, Client, ContainerBuilder,
    EmbedBuilder, FileBuilder,
    Guild,
    GuildMember, GuildTextBasedChannel, Interaction,
    Message, MessageCreateOptions,
    MessageFlags,
    ModalBuilder,
    ModalSubmitInteraction,
    PermissionsBitField,
    PermissionsString,
    PrivateThreadChannel, Role, SectionBuilder, StringSelectMenuBuilder,
    StringSelectMenuInteraction, TextBasedChannel,
    TextChannel, TextDisplayBuilder,
    TextInputBuilder, TextInputStyle,
    ThreadChannel,
    User
} from "discord.js";
import {convertToEmojiPng} from "./emojis.js";
import {ExtendedClient} from "../types/client.js";
import {ModalData} from "../types/ticket.js";
import {randomUUID} from "crypto";
import {cli} from "winston/lib/winston/config/index.js";
import {createTranscript, ExportReturnType} from "discord-html-transcripts";
import ticket from "../modules/ticket/commands/ticket.js";
import {replacePlaceholders} from "../main/placeholder.js";

export async function ticketHelper(
    ticketSetupId: string,
    ticketType: "event" | "interaction",
    client: ExtendedClient,
    interaction?: StringSelectMenuInteraction | ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction,
    modal?: ModalSubmitInteraction,
    messageEvent?: Message,
) {
    let guild: Guild;
    let user: GuildMember
    if (ticketType == "event") {
        guild = messageEvent.guild;
        user = messageEvent.member;
    } else if (ticketType == "interaction") {

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        })

        guild = interaction.guild;
        user = interaction.member as GuildMember;
    }


    const data = await database.ticketSetups.findFirst({
        include: {
            ModalOptions: true,
            TicketPermissions: true,
            Tickets: true,
        },
        where: {
            CustomId: ticketSetupId
        }
    })

    // Validate Ticket
    if (data.TicketPermissions.length <= 0) {
        const isOneTicketMod = data.TicketPermissions.some((p) => p.IsHandler == true)
        if (!isOneTicketMod) {
            return;
        }
    }

    // EnableTicketsOnlyFromTime
    if (data.EnableTicketsOnlyFromTime) {

        const [startStr, endStr] = data.EnableTicketsOnlyFromTime.split(',');
        const [startHour, startMinute] = startStr.split(':').map(Number);

        const [endHour, endMinute] = endStr.split(':').map(Number);

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;

        if (!(currentMinutes > startMinutes && currentMinutes <= endMinutes)) {
            if (ticketType == "event") {
                (messageEvent.channel as TextChannel).send({
                    content: `-# ${await convertToEmojiPng("ticket", client.user.id)} You only can open Tickets from ${startStr}-${endStr}!`
                }).then(async (m) => {
                    setTimeout(async () => {
                        await m.delete()
                    }, 5000)
                })
                return;
            } else if (ticketType == "interaction") {
                await interaction.editReply({
                    content: `-# ${await convertToEmojiPng("ticket", client.user.id)} You only can open Tickets from ${startStr}-${endStr}!`
                })
                return;
            }
        }
    }

    // Blacklist
    if (data.TicketBlacklistRoles.length > 0) {
        for (const roleId of data.TicketBlacklistRoles) {
            const role = guild.roles.cache.get(roleId)
            if (!role) {
                return;
            }
            if (user.roles.cache.has(roleId)) {
                if (ticketType == "event") {
                    (messageEvent.channel as TextChannel).send({
                        content: `-# ${await convertToEmojiPng("ticket", client.user.id)} You are blacklisted for this Ticket!`
                    }).then(async (m) => {
                        setTimeout(async () => {
                            await m.delete()
                        }, 5000)
                    })
                    return;
                } else if (ticketType == "interaction") {
                    await interaction.editReply({
                        content: `-# ${await convertToEmojiPng("ticket", client.user.id)} You are blacklisted for this Ticket!`
                    })
                    return;
                }
            }
        }
    }

    // Cooldown
    if (data.TicketCreationCooldownPerUser) {
        const cooldownTime = 3000
        const cooldownKey = `${user.id}:${data.CustomId}`;
        const now = Date.now();

        if (client.cooldowns?.has(cooldownKey)) {
            const expiration = client.cooldowns.get(cooldownKey)! + cooldownTime;
            if (now < expiration) {
                const emoji = await convertToEmojiPng("timer", client.user!.id);
                const timestamp = Math.floor(expiration / 1000);

                return await this.sendReply(interaction, emoji, `Please wait <t:${timestamp}:R> before using this command again.`)
            }
        }
        client.cooldowns?.set(cooldownKey, now)
        setTimeout(() => client.cooldowns?.delete(cooldownKey), cooldownTime)
    }

    // RequiredRoles
    if (data.RequiredRoles.length > 0) {
        if (!user.roles.cache.some((r) => data.RequiredRoles.includes(r.id))) {

            if (ticketType == "event") {
                (messageEvent.channel as TextChannel).send({
                    allowedMentions: {
                        repliedUser: false,
                    },
                    content: `-# ${await convertToEmojiPng("ticket", client.user.id)} You need one of the Required Roles! \n > -# ${data.RequiredRoles.map((r) => `<@&${r}>`).join(", ")}`
                }).then(async (m) => {
                    setTimeout(async () => {
                        await m.delete()
                    }, 5000)
                })
                return;
            } else if (ticketType == "interaction") {
                await interaction.editReply({
                    content: `-# ${await convertToEmojiPng("ticket", client.user.id)} You need one of the Required Roles! \n > -# ${data.RequiredRoles.map((r) => `<@&${r}>`).join(", ")}`
                })
                return;
            }
        }
    }

    // TicketLimit
    if (data.TicketLimit) {
        const ticketsPerUser = await database.tickets.findMany({
            where: {
                TicketOwnerId: user.id
            }
        })

        if (ticketsPerUser.length >= data.TicketLimit) {
            if (ticketType == "event") {
                (messageEvent.channel as TextChannel).send({
                    content: `-# ${await convertToEmojiPng("ticket", client.user.id)} You have reached the ticket limit! You can only open ${data.TicketLimit} more tickets.`
                }).then(async (m) => {
                    setTimeout(async () => {
                        await m.delete()
                    }, 5000)
                })
                return;
            } else if (ticketType == "interaction") {
                await interaction.editReply({
                    content: `-# ${await convertToEmojiPng("ticket", client.user.id)} You have reached the ticket limit! You can only open ${data.TicketLimit} more tickets.`
                })
                return;
            }
        }

    }


    let messageData = await database.messageTemplates.findFirst({
        where: {
            Name: data.MessageTemplateId ?? ""
        }
    })

    if (!messageData) {
        const ticketTemplateMessage = await fetch("https://cdn.xyzhub.link/raw/VqvWD9.json?download=true")
        const ticketTemplateMessageData = await ticketTemplateMessage.json()
        messageData = {
            id: "not-used",
            GuildId: guild.id,
            Content: null,
            EmbedJSON: JSON.stringify(ticketTemplateMessageData),
            Name: "ticket-not-found",
            OtherEmbeds: []
        }
    }

    const ticketId = randomUUID()
    const ticketPlaceholderType = {
        member: {
            name: user.user.username,
            username: user.user.username,
            tag: `<@${user.user.id}>`,
            id: user.user.id,
            displayName: user.user.displayName,
            globalName: user.user.globalName,
            avatar: user.displayAvatarURL()
        },
        ticket: {
            id: ticketId,
            autoCloseAfterInactivity: data.AutoCloseAfterInactivity / 1000,
            autoCloseAfterTime: data.AutoCloseAfterTime / 1000,
        },
        modal: {
            option: {
                1: modal?.fields?.getTextInputValue("0") ?? "N/A",
                2: modal?.fields?.getTextInputValue("1") ?? "N/A",
                3: modal?.fields?.getTextInputValue("2") ?? "N/A",
                4: modal?.fields?.getTextInputValue("3") ?? "N/A",
                5: modal?.fields?.getTextInputValue("4") ?? "N/A",
            }
        }
    }

    const category = await guild.channels.fetch(data.CategoryId)
    let channel: TextChannel | ThreadChannel
    const IsThread = data.ChannelType == ChannelType.PrivateThread
    const IsChannel = data.ChannelType == ChannelType.GuildCategory
    if (data.ChannelType == ChannelType.GuildCategory) {
        channel = await guild.channels.create({
            name: replacePlaceholders(data.TicketChannelName, ticketPlaceholderType),
            parent: category.id,
            type: ChannelType.GuildText
        })
    } else if (data.ChannelType == ChannelType.PrivateThread) {
        channel = await (category as TextChannel).threads.create({
            name: replacePlaceholders(data.TicketChannelName, ticketPlaceholderType),
            type: ChannelType.PrivateThread
        })
    } else {
        return
    }

    // Channel Permissions
    if ((IsChannel || IsThread) && data.TicketPermissions) {
        if (IsChannel) {
            for (const perms of data.TicketPermissions) {
                const permissions: Record<string, boolean> = {};

                if (Array.isArray(perms.DeniedDiscordPermissions)) {
                    const denyList = new PermissionsBitField(perms.DeniedDiscordPermissions).toArray();
                    for (const d of denyList) {
                        permissions[d] = false;
                    }
                }

                if (Array.isArray(perms.AllowedDiscordPermissions)) {
                    const allowList = new PermissionsBitField(perms.AllowedDiscordPermissions).toArray();
                    for (const a of allowList) {
                        permissions[a] = true;
                    }
                }

                const target = perms.DiscordRoleId ?? perms.DiscordUserId;
                if (target) {
                    await (channel as TextChannel).permissionOverwrites.create(target, permissions);
                }
            }
            await (channel as TextChannel).permissionOverwrites.create(data.GuildId, {
                ViewChannel: false,
            });
        }


        // Shadow Ping
        for (const perms of data.TicketPermissions) {
            if (perms.HasShadowPing) {
                // Thread
                if (IsThread && perms.DiscordRoleId) {
                    const roleMembers = guild.roles.cache.get(perms.DiscordRoleId)
                    for (const member of roleMembers.members.keys()) {
                        await (channel as ThreadChannel).members.add(member)
                    }

                } else if (IsThread && perms.DiscordUserId) {
                    await (channel as ThreadChannel).members.add(perms.DiscordUserId)
                }
                // Channel
                else if (IsChannel && perms.DiscordRoleId) {
                    channel.send({
                        content: `<@&${perms.DiscordRoleId}>`
                    }).then(async (m) => {
                        await m.delete()
                    })
                } else if (IsChannel && perms.DiscordUserId) {
                    channel.send({
                        content: `<@${perms.DiscordUserId}>`
                    }).then(async (m) => {
                        await m.delete()
                    })
                }
            }
        }
    }

    if (messageData.EmbedJSON) {
        await channel.send({
            content: messageData.Content ? replacePlaceholders(messageData.Content ?? "", ticketPlaceholderType) : null,
            embeds: [
                new EmbedBuilder(JSON.parse(replacePlaceholders(messageData.EmbedJSON, ticketPlaceholderType)))
            ]
        })
    } else {
        await channel.send({
            content: replacePlaceholders(messageData.Content ?? "", ticketPlaceholderType) ?? null,
        })
    }

    let autoHandler: string

    if (data.AutoAssignHandler) {
        const role = guild.roles.cache.get(data.AutoAssignHandler)
        if (!role) {
            return
        }
        const randomNum = Math.random() * role.members.size

        autoHandler = role.members[randomNum].id
    }


    await channel.send({
        components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("ticket-actions:" + ticketId)
                    .setEmoji("<:ticket:1400577766205816852>")
                    .setStyle(ButtonStyle.Secondary)
            )
        ]
    }).then(async (m) => {
        await m.pin("Ticket-Manage-Component")
        const lastMessage = channel.messages.cache.get(channel.lastMessageId)
        await lastMessage.delete()
    })
    await database.tickets.create({
        data: {
            GuildId: guild.id,
            TicketId: ticketId,
            TicketOwnerId: user.id,
            CreatedAt: new Date,
            IsClosed: false,
            IsLocked: false,
            TicketNotes: [],
            ChannelType: data.ChannelType,
            ...(data.ChannelType == ChannelType.PrivateThread ? {ThreadId: channel.id} : {ChannelId: channel.id}),
            ...(data.AutoAssignHandler ? {
                UserWhoHasClaimedId: autoHandler,
                IsClaimed: true,
                AutoAssignHandler: data.AutoAssignHandler
            } : {
                IsClaimed: false
            }),
            ...(data.WithTicketFeedback ? {
                WithTicketFeedback: data.WithTicketFeedback,
                TicketFeedbackChannelId: data.TicketFeedbackChannelId,
            } : {
                WithTicketFeedback: false
            }),
            ...(data.UserDMWhenCloseMessageTemplateId ? {
                UserDMWhenCloseMessageTemplateId: data.UserDMWhenCloseMessageTemplateId,
            } : {}),
            ...(data.AutoReplyMessageTemplateId ? {
                AutoReplyMessageTemplateId: data.AutoReplyMessageTemplateId,
            } : {}),
            ...(data.AutoCloseAction ? {
                AutoCloseAction: data.AutoCloseAction,
            } : {
                AutoCloseAction: []
            }),
            ...(data.OldTicketCategoryId ? {
                OldTicketCategoryId: data.OldTicketCategoryId,
            } : {}),
            ...(data.SendTranscriptToUser ? {
                SendTranscriptToUser: data.SendTranscriptToUser,
            } : {}),
            IsArchived: false,
            ...(data.TranscriptChannelId ? {
                TranscriptChannelId: data.TranscriptChannelId,
            } : {}),
            OnlyClaimMode: data.OnlyClaimMode ?? false,
            TicketSetup: {
                connect: {
                    CustomId: data.CustomId
                }
            }
        }
    })

    if (ticketType == "event") {
        (messageEvent.channel as TextChannel).send({
            allowedMentions: {
                repliedUser: false,
            },
            content: `-# ${await convertToEmojiPng("ticket", client.user.id)} Your ticket has beed created here ${channel.url}`
        }).then(async (m) => {
            setTimeout(async () => {
                await m.delete()
            }, 5000)
        })
        return;
    } else if (ticketType == "interaction") {
        await interaction.editReply({
            content: `-# ${await convertToEmojiPng("ticket", client.user.id)} Your ticket has beed created here ${channel.url}`
        })
        return;
    }
}

export async function ticketErrorMessage(message: string, interaction: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction, client: ExtendedClient) {
    return await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: `## ${await convertToEmojiPng("error", client.user.id)} Your ticket action failed with: ${message}`,
    })
}

export async function handleCloseAction(client: ExtendedClient, guild: Guild, channel: TextChannel | PrivateThreadChannel, ticketId: string, confirm?: boolean, reason?: string, isAuto?: boolean, interaction?: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction) {
    let actionCounter: number = 0

    const data = await database.tickets.findFirst({
        where: {
            TicketId: ticketId
        }
    })
    if (!data) return await ticketErrorMessage("No Data!", interaction, client)

    const owner = await guild.members.fetch(data.TicketOwnerId)

    const actions = data.AutoCloseAction

    if (actions.includes("confirm") && !confirm && !isAuto) {
        actionCounter += 1
        return await interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: "-# **You need to confirm your action**",
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId("ticket-close-action-confirm:" + ticketId)
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel("Confirm")
                        .setEmoji("<:check:1320090167444377713>")
                )
            ]
        })
    }
    if (actions.includes("reason") && !reason && !isAuto) {
        actionCounter += 1
        const modal = new ModalBuilder()
        const reason = new TextInputBuilder()

        modal
            .setTitle("Close Reason")
            .setCustomId("ticket-close-action-reason:" + ticketId + ":" + confirm)

        reason
            .setCustomId("reason")
            .setStyle(TextInputStyle.Short)
            .setLabel("Reason")
            .setRequired(true)

        modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(reason))
        return await (interaction as unknown as ChatInputCommandInteraction | ButtonInteraction | AnySelectMenuInteraction).showModal(modal)
    }
    if (reason) {
        await database.tickets.update({
            where: {
                TicketId: ticketId
            },
            data: {
                CloseActionReason: reason
            }
        })
    }

    if (!isAuto)
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
        })

    if (data.UserDMWhenCloseMessageTemplateId) {
        actionCounter += 1

        if (!isAuto)
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} User DM has been sent.`,
            })

        const messageData = await database.messageTemplates.findFirst({
            where: {
                Name: data.UserDMWhenCloseMessageTemplateId
            }
        })

        const ticketPlaceholderType = {
            member: {
                name: owner.user.username,
                username: owner.user.username,
                tag: `<@${owner.user.id}>`,
                id: owner.user.id,
                displayName: owner.user.displayName,
                globalName: owner.user.globalName,
                avatar: owner.displayAvatarURL()
            },
            ticket: {
                id: ticketId,
                reason: reason,
                isClosed: data.IsClosed,
                isClaimed: data.IsClaimed,
                userWhoHasClaimedId: data.UserWhoHasClaimedId,
                userWhoHasClaimedTag: `<@${data.UserWhoHasClaimedId}>`,
                userWhoHasClaimedName: guild.members.cache.get(data.UserWhoHasClaimedId).user.username,
                isLocked: data.IsLocked,
                isArchived: data.IsArchived,
            },
        }

        await owner.createDM(true)
        if (messageData.EmbedJSON) {
            await owner.send({
                content: replacePlaceholders(messageData.Content, ticketPlaceholderType) ?? "",
                embeds: [new EmbedBuilder(JSON.parse(replacePlaceholders(messageData.EmbedJSON, ticketPlaceholderType)))]
            })
        } else {
            await owner.send({
                content: messageData.Content ?? "",
            })
        }

        await owner.send({
            content: `-# Message from ${interaction.guild.name}. Ticket Closed with ID ${ticketId}.`,
        })
    }
    if (data.WithTicketFeedback) {
        actionCounter += 1

        if (!isAuto)
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} Feedback message sent to user`,
            })

        await owner.createDM(true)
        await owner.send({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            [
                                `## ${await convertToEmojiPng("star", client.user.id)} Feedback`,
                                ``,
                                `We’d love to hear your thoughts!`,
                                `Please rate our support team from 1 to 5 stars and let us know the reason for your rating.`,
                                `Your feedback helps us improve!`,
                                ``,
                                `> Thank you for using our support!`,
                                ``
                            ].join("\n")
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("ticket-close-action-feedback:" + ticketId)
                                .setPlaceholder("Give a fair rating 1 to 5 Stars!")
                                .setMaxValues(1)
                                .setMinValues(0)
                                .setOptions(
                                    [
                                        {
                                            label: "⭐",
                                            emoji: "<:star:1404550503576240289>",
                                            description: "Give a rating of 1 Stars!",
                                            value: "one"
                                        },
                                        {
                                            label: "⭐⭐",
                                            emoji: "<:star:1404550503576240289>",
                                            description: "Give a rating of 2 Stars!",
                                            value: "two"
                                        },
                                        {
                                            label: "⭐⭐⭐",
                                            emoji: "<:star:1404550503576240289>",
                                            description: "Give a rating of 3 Stars!",
                                            value: "three"
                                        },
                                        {
                                            label: "⭐⭐⭐⭐",
                                            emoji: "<:star:1404550503576240289>",
                                            description: "Give a rating of 4 Stars!",
                                            value: "four"
                                        },
                                        {
                                            label: "⭐⭐⭐⭐⭐",
                                            emoji: "<:star:1404550503576240289>",
                                            description: "Give a rating of 5 Stars!",
                                            value: "five"
                                        }
                                    ]
                                )
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-close-action-feedback-comment:" + ticketId)
                                .setLabel("Add a Comment")
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:message:1322252985702551767>"),
                            new ButtonBuilder()
                                .setCustomId("ticket-close-action-feedback-save:" + ticketId)
                                .setLabel("Send your feedback!")
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:star:1404550503576240289>")
                        )
                    )
            ]
        })
    }
    if (data.SendTranscriptToUser) {
        actionCounter += 1

        if (!isAuto)
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} Transcript sent to user`,
            })

        await ticketTranscriptBuilder(
            ticketId,
            client,
            guild,
            channel,
            owner,
            interaction ? interaction : null
        )
        await owner.send({
            content: `-# Message from ${interaction.guild.name}. Transcript sent from ticket with ID ${ticketId}.`,
        })

    }
    if (actions.includes("look")) {
        actionCounter += 1

        if (!isAuto)
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} Thread has beed looked!`,
            })

        await ticketLookAction(
            channel,
            client,
            ticketId,
            true
        )
    }
    if (actions.includes("archive")) {
        actionCounter += 1

        if (!isAuto)
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} Ticket has beed archived.`,
            })

        await ticketArchiveAction(
            channel,
            client,
            ticketId,
            true
        )
    }
    if (actions.includes("channel")) {
        actionCounter += 1

        if (!isAuto)
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} Channel has beed looked!`,
            })

        await ticketLookAction(
            channel,
            client,
            ticketId,
            true
        )
    }
    if (actions.includes("remove_user_from_ticket")) {
        actionCounter += 1

        await interaction.editReply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} Removed user from ticket.`,
        })

        const addedMembers = data.AddedMemberIds
        if (data.ChannelType == ChannelType.PrivateThread) {

            for (const member of addedMembers) {
                await (interaction.channel as PrivateThreadChannel).members.remove(
                    member
                )
            }
            await (interaction.channel as PrivateThreadChannel).members.remove(
                data.TicketOwnerId
            )

        } else if (data.ChannelType == ChannelType.GuildCategory) {
            await (interaction.channel as TextChannel).permissionOverwrites.edit(data.TicketOwnerId, {
                ViewChannel: false
            })

            for (const memberId of data.AddedMemberIds) {
                await (interaction.channel as TextChannel).permissionOverwrites.edit(memberId, {
                    ViewChannel: false
                })
            }

        }
    }
    if (data.TranscriptChannelId) {
        actionCounter += 1

        if (!isAuto)
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} Exported Ticket-Transcript to Channel.`,
            })

        const tChannel = await guild.channels.fetch(data.TranscriptChannelId) as TextChannel | PrivateThreadChannel

        const transcript = await ticketTranscriptBuilder(
            ticketId,
            client,
            guild,
            channel,
            null,
            null
        )

        const message = await tChannel.send(transcript as MessageCreateOptions)

        if (!isAuto)
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} Exported Ticket-Transcript ${message.url}`,
            })
    }
    if (data.OldTicketCategoryId) {
        actionCounter += 1

        if (!isAuto)
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} Moved Channel to <#${data.OldTicketCategoryId}>`,
            })

        if (data.ChannelType == ChannelType.PrivateThread) return
        await (channel as TextChannel).setParent(data.OldTicketCategoryId)
    }

    await database.tickets.update({
        where: {
            TicketId: ticketId
        },
        data: {
            IsClosed: true,
            IsAutoDone: true,
            ClosedAt: new Date
        }
    })

    actionCounter += 1
    await channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [
            new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`### ${await convertToEmojiPng("ticket", client.user.id)} Ticket has beed closed!${reason ? `\n> ### ${await convertToEmojiPng("info", client.user.id)} ***Reason: ${reason}***` : ``}`)
                )
        ]
    })

    if (!isAuto)
        await interaction.editReply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} Ticket Close actions successfully executed! (${actionCounter} executed)`,
        })

    // To prevent errors, execute at the end!
    if (actions.includes("delete")) {
        actionCounter += 1

        if (!isAuto)
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} Channel Deleted!`,
            })

        await interaction.channel.delete(`Ticket Close action by ${interaction.user.username} (${interaction.user.id})`)
    }

}

export async function ticketArchiveAction(channel: TextChannel | PrivateThreadChannel, client: ExtendedClient, ticketId: string, isClose?: boolean, interaction?: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction) {
    const uuid = ticketId

    const data = await database.tickets.findFirst({
        where: {
            TicketId: uuid
        }
    })

    if (!data && !isClose) {
        return ticketErrorMessage("No Ticket found", interaction, client)
    }

    if (!isClose) {
        if (data.IsLocked) {
            return ticketErrorMessage("Ticket is Looked", interaction, client)
        }

        if (data.IsArchived) {
            return ticketErrorMessage("Ticket is Archived", interaction, client)
        }

        if (!data.IsClosed) {
            return ticketErrorMessage("Ticket is not closed!", interaction, client)
        }
    }


    await channel.setName(`archived-${channel.name}`)

    await database.tickets.update({
        where: {
            TicketId: uuid
        },
        data: {
            IsArchived: true
        }
    })

    if (data.ChannelType == ChannelType.PrivateThread) {

        await (channel as PrivateThreadChannel).setLocked(true, "Moderator Action from Ticket with Id " + uuid)

    } else if (data.ChannelType == ChannelType.GuildCategory) {

        await (channel as TextChannel).permissionOverwrites.edit(data.TicketOwnerId, {
            SendMessages: false
        })

        for (const memberId of data.AddedMemberIds) {
            await (channel as TextChannel).permissionOverwrites.edit(memberId, {
                SendMessages: false
            })
        }

    }


    const message = await channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [
            new ContainerBuilder()

                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(new TextDisplayBuilder().setContent("### Ticket is Archived. Moderators can manage this ticket"))
                        .setButtonAccessory(new ButtonBuilder()
                            .setEmoji("<:ticket:1400577766205816852>")
                            .setCustomId("ticket-actions")
                            .setStyle(ButtonStyle.Secondary)
                        ))
        ]
    })

    await database.tickets.update({
        where: {
            TicketId: uuid
        },
        data: {
            ArchiveMessageId: message.id
        }
    })
}

export async function ticketLookAction(channel: TextChannel | PrivateThreadChannel, client: ExtendedClient, ticketId: string, isClose?: boolean, interaction?: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction, isAuto?: boolean) {
    const uuid = ticketId
    const data = await database.tickets.findFirst({
        where: {
            TicketId: uuid
        }
    })

    if (!data && !isAuto) {
        return ticketErrorMessage("No Ticket found", interaction, client)
    }

    if (!isAuto && !isClose && data.IsLocked && (await hasTicketPermission("disable_lock", interaction.member as GuildMember, data.TicketId, client) || await hasTicketPermission("all", interaction.member as GuildMember, data.TicketId, client))) {

        await database.tickets.update({
            where: {
                TicketId: uuid
            },
            data: {
                IsLocked: false
            }
        })

        await channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`### ${await convertToEmojiPng("ticket", client.user.id)} ${interaction.user} has unlocked the ticket.`)
                    )
            ]
        })

        if (data.ChannelType == ChannelType.PrivateThread) {

            await (channel as PrivateThreadChannel).setLocked(false, "Moderator Action from Ticket with Id " + uuid)

        } else if (data.ChannelType == ChannelType.GuildCategory) {

            await (channel as TextChannel).permissionOverwrites.edit(data.TicketOwnerId, {
                SendMessages: true
            })

            for (const memberId of data.AddedMemberIds) {
                await (channel as TextChannel).permissionOverwrites.edit(memberId, {
                    SendMessages: true
                })
            }

        }

        if (!isAuto) await interaction.reply({
            content: `## ${await convertToEmojiPng("lockopen", client.user.id)} You unlocked the Ticket successfully!`,
            flags: MessageFlags.Ephemeral,
        })
    }

    await database.tickets.update({
        where: {
            TicketId: uuid
        },
        data: {
            IsLocked: true
        }
    })

    if (data.ChannelType == ChannelType.PrivateThread) {

        await (channel as PrivateThreadChannel).setLocked(true, "Moderator Action from Ticket with Id " + uuid)

    } else if (data.ChannelType == ChannelType.GuildCategory) {

        await (channel as TextChannel).permissionOverwrites.edit(data.TicketOwnerId, {
            SendMessages: false
        })

        for (const memberId of data.AddedMemberIds) {
            await (channel as TextChannel).permissionOverwrites.edit(memberId, {
                SendMessages: false
            })
        }

    }

    await channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [
            new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`### ${await convertToEmojiPng("ticket", client.user.id)} ${interaction?.user ?? "System"} has locked the ticket.`)
                )
        ]
    })
    if (!isClose && !isAuto) {
        return await interaction.reply({
            content: `## ${await convertToEmojiPng("lock", client.user.id)} You locked the Ticket successfully! Unlock the ticket with a new Click.`,
            flags: MessageFlags.Ephemeral,
        })
    }
}


export async function ticketTranscriptBuilder(
    ticketId: string,
    client: ExtendedClient,
    guild: Guild,
    channel: TextChannel | ThreadChannel,
    user?: GuildMember,
    interaction?: ChatInputCommandInteraction | ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction
) {
    const data = await database.tickets.findFirst({
        include: {
            TicketSetup: {
                include: {
                    TicketPermissions: true,
                },
            },
        },
        where: {
            TicketId: ticketId,
        },
    });

    const addedMembers = data.AddedMemberIds.map((memberId) => {
        const member = guild?.members.cache.get(memberId);
        return {
            Name: member?.user.tag || 'Unknown',
            AvatarUrl: member?.user.displayAvatarURL() || '',
            Id: memberId,
        };
    });

    const ticketData = {
        ChannelName: channel.name,
        ChannelType: channel.type === ChannelType.PrivateThread ? 'Thread' : 'Channel',
        OwnerId: data.TicketOwnerId,
        Claimed: data.IsClaimed,
        Closed: data.IsClosed,
        Looked: data.IsLocked,
        Archived: data.IsArchived,
        AddedMembers: addedMembers,
        WhoHasClaimed: data.UserWhoHasClaimedId,
        MessageCount: channel.messages.cache.size,
        Permissions: data.TicketSetup.TicketPermissions,
        TicketNotes: data.TicketNotes,
    };

    // @ts-ignore
    const rawBuffer = await createTranscript(channel, {
        poweredBy: false,
        favicon: 'guild',
        filename: `transcript-${data.TicketId}-${data.TicketOwnerId}.html`,
        footerText: '',
        saveImages: true,
        returnType: ExportReturnType.Buffer,
    });

    let html = rawBuffer.toString('utf-8');

    const ticketMetaHTML = `
    <div class="ticket-meta" style="padding: 1rem; margin: 1rem; background: #1e1e1e; color: #fff; border-radius: 8px; border-left: 4px solid #7289da; font-family: 'Segoe UI', sans-serif;">
        <h2 style="color: #7289da; margin-top: 0;">Ticket-Export</h2>
        <div style="display: grid; grid-template-columns: max-content 1fr; gap: 0.5rem; align-items: center;">
            <span style="color: #b9bbbe;">Channel:</span>
            <span>${ticketData.ChannelName} (${ticketData.ChannelType})</span> 
            
            <span style="color: #b9bbbe;">Owner:</span>
            <span>${guild.members.cache.get(ticketData.OwnerId).displayName} (${ticketData.OwnerId})</span>
            
            <span style="color: #b9bbbe;">Status:</span>
            <span>${ticketData.Closed ? '🔴 Closed' : '🟢 Open'}</span>
            
            <span style="color: #b9bbbe;">Message Count:</span>
            <span>${ticketData.MessageCount}</span>
            
            <span style="color: #b9bbbe;">Added Members:</span>
            <span>${ticketData.AddedMembers.map(m => m.Name).join(', ') || 'None'}</span>
            
            <span style="color: #b9bbbe;">Notes:</span>
            <span>${ticketData.TicketNotes.length > 0 ? ticketData.TicketNotes : 'No notes provided'}</span>
        </div>
    </div>`;

    const siliconCSS = `
    <style>
        body {
            background: #1e1e1e;
            color: #e0e0e0;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            line-height: 1.5;
            padding: 1rem;
        }
        discord-messages {
            background: #2e2e2e;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
        }
        discord-message {
            background: transparent;
            padding: 0.5rem 1rem;
            margin: 0 -1rem;
            border-radius: 4px;
        }
        discord-message:hover {
            background: #3a3a3a;
        }
        discord-author-name {
            color: #7289da;
            font-weight: 500;
        }
        .ticket-meta {
            background: #2e2e2e;
            border-left: 4px solid #7289da;
        }
    </style>`;

    const headEndIndex = html.indexOf('</head>');
    const bodyStartIndex = html.indexOf('<body>') + 6;

    if (headEndIndex !== -1 && bodyStartIndex !== -1) {
        html = html.slice(0, headEndIndex) + siliconCSS + html.slice(headEndIndex);

        html = html.slice(0, bodyStartIndex) + ticketMetaHTML + html.slice(bodyStartIndex);
    } else {
        html = `<!DOCTYPE html><html><head>${siliconCSS}</head><body>${ticketMetaHTML}${html}</body></html>`;
    }

    const finalBuffer = Buffer.from(html, 'utf-8');
    const jsonFile = Buffer.from(JSON.stringify(ticketData), "utf-8")

    await database.tickets.update({
        where: {
            TicketId: ticketId
        },
        data: {
            TranscriptJSON: JSON.stringify(ticketData),
            TranscriptHTML: html
        }
    })

    const message =
        {
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent([
                            `## ${await convertToEmojiPng("ticket", client.user.id)} Ticket-Transcript Export`,
                            ``,
                            `> **Ticket-ID**: \`${data.TicketId}\``,
                            `> **Owner**: <@${data.TicketOwnerId}>`,
                            `> **Channel**: \`${channel.name}\` (${channel.type === ChannelType.PrivateThread ? 'Thread' : 'Channel'})`,
                            `> **Status**: ${data.IsClosed ? 'Closed' : 'Open'}, ${data.IsLocked ? 'Locked' : 'UnLocked'}, ${data.IsArchived ? 'Achrived' : 'Un-Archived'}`,
                            `> **Claimed by**: ${data.UserWhoHasClaimedId ? `<@${data.UserWhoHasClaimedId}>` : 'Not Claimed'}`,
                            `> **Message Count**: ${channel.messages.cache.size}`,
                            `> **Notes**: ${data.TicketNotes?.length ? 'In Transcript' : 'N/A'}`,
                        ].join("\n"))
                    )
                    .addFileComponents(
                        new FileBuilder().setURL(`attachment://transcript-${ticketId}.html`)
                    )
                    .addFileComponents(
                        new FileBuilder().setURL(`attachment://transcript-${ticketId}.json`)
                    )
            ],
            files: [
                new AttachmentBuilder(finalBuffer).setName(`transcript-${ticketId}.html`),
                new AttachmentBuilder(jsonFile).setName(`transcript-${ticketId}.json`),
            ]
        }

    if (user) {
        await user.createDM(true)
        return await user.send(message);
    }

    if (interaction)
        return await (interaction as unknown as ChatInputCommandInteraction | AnySelectMenuInteraction | ButtonInteraction).reply(message);

    return message
}

export async function ticketActionsHelper(client: ExtendedClient, ticketId: string, interaction: ButtonInteraction | ChatInputCommandInteraction) {

    const data = await database.tickets.findFirst({
        where: {
            TicketId: ticketId
        }
    })

    const member = interaction.member as GuildMember;

    const permissions = {
        close: await hasTicketPermission("close", member, data.TicketId, client),
        archive: await hasTicketPermission("archive", member, data.TicketId, client),
        reopen: await hasTicketPermission("reopen", member, data.TicketId, client),
        claim: await hasTicketPermission("claim", member, data.TicketId, client),
        transcript: await hasTicketPermission("transcript", member, data.TicketId, client),
        close_request: await hasTicketPermission("close_request", member, data.TicketId, client),
        infos: await hasTicketPermission("infos", member, data.TicketId, client),
        notes: await hasTicketPermission("notes", member, data.TicketId, client),
        lock: await hasTicketPermission("look", member, data.TicketId, client),
        add_member_to_ticket: await hasTicketPermission("add_member_to_ticket", member, data.TicketId, client),
        remove_user_from_ticket: await hasTicketPermission("remove_user_from_ticket", member, data.TicketId, client),
        all: await hasTicketPermission("all", member, data.TicketId, client)
    };

    await interaction.reply({
        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        components: [
            new ContainerBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### **${await convertToEmojiPng("ticket", client.user.id)} Manage the Ticket with the buttons you see.**`))
                .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ticket-close:${ticketId}`)
                        .setLabel("Close Ticket")
                        .setEmoji("<:x_:1322169218682322955>")
                        .setDisabled(!(permissions.close || permissions.all))
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId(`ticket-archive:${ticketId}`)
                        .setLabel("Archive Ticket")
                        .setEmoji("<:package:1365715766623604746>")
                        .setDisabled(!(permissions.archive || permissions.all))
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId(`ticket-reopen:${ticketId}`)
                        .setLabel("Re-open Ticket")
                        .setEmoji("<:reopen:1289668008503148649>")
                        .setDisabled(!(permissions.reopen || permissions.all))
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId(`ticket-claim:${ticketId}`)
                        .setLabel("Claim Ticket")
                        .setEmoji("<:subtitle:1321938231788568586>")
                        .setDisabled(!(permissions.claim || permissions.all))
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId(`ticket-transcript:${ticketId}`)
                        .setLabel("Transcript Ticket")
                        .setEmoji("<:file:1381000301124911134>")
                        .setDisabled(!(permissions.transcript || permissions.all))
                        .setStyle(ButtonStyle.Secondary),
                ))
                .addActionRowComponents(
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`ticket-close-request:${ticketId}`)
                            .setLabel("Close Request Ticket")
                            .setEmoji("<:hand:1402336798084174025>")
                            .setDisabled(!(permissions.close_request || permissions.all))
                            .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                            .setCustomId(`ticket-infos:${ticketId}`)
                            .setLabel("Ticket Infos")
                            .setEmoji("<:info:1260322428140130365>")
                            .setDisabled(!(permissions.infos || permissions.all))
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId(`ticket-notes:{ ticketId} `)
                            .setLabel("Ticket Notes")
                            .setEmoji("<:notebook:1402343486833033317>")
                            .setDisabled(!(permissions.notes || permissions.all))
                            .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                            .setCustomId(`ticket-lock:${ticketId}`)
                            .setLabel("Lock Ticket")
                            .setEmoji("<:lock:1279386908455080021>")
                            .setDisabled(!(permissions.lock || permissions.all))
                            .setStyle(ButtonStyle.Secondary),
                    ))
                .addActionRowComponents(
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`ticket-members:${ticketId}`)
                            .setLabel("Manage Users")
                            .setEmoji("<:userdetail:1321937833296134205>")
                            .setDisabled(!(permissions.add_member_to_ticket || permissions.remove_user_from_ticket || permissions.all))
                            .setStyle(ButtonStyle.Secondary),
                    ))
        ]
    });
}

export const ticketActions = [
    {
        label: "All",
        value: "all",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Claim Bypass",
        value: "claim_bypass",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Close",
        value: "close",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Archive",
        value: "archive",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Re-open",
        value: "reopen",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Claim",
        value: "claim",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Transcript",
        value: "transcript",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Close Request",
        value: "close_request",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Confirm Close Request",
        value: "confirm-user-close",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "View Notes",
        value: "notes",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Delete Notes",
        value: "notes_delete",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Perform Note Action",
        value: "notes_actions",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "View Infos",
        value: "infos",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Lock Ticket",
        value: "look",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Lock Bypass",
        value: "look_bypass",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Disable Lock",
        value: "disable_lock",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Add Member to Ticket",
        value: "add_member_to_ticket",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Remove user from Ticket",
        value: "remove_user_from_ticket",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Allow extra Channel Permissions in Ticket",
        value: "add_extra_channel_perms",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Deny extra Channel Permissions in Ticket",
        value: "remove_extra_channel_perms",
        emoji: "<:permissions:1277170947761111130>"
    },
]

export async function hasTicketPermission(permission: string, user: GuildMember, ticketId: string, client: ExtendedClient) {
    const data = await database.tickets.findFirst({
        include: {
            TicketSetup: {
                include: {
                    TicketPermissions: true
                }
            }
        },
        where: {
            TicketId: ticketId
        }
    })
    const guildMember = client.guilds.cache.get(data.GuildId).members.cache.get(user.id)


    for (const perms of data.TicketSetup.TicketPermissions) {
        if (guildMember.roles.cache.has(perms.DiscordRoleId)) {
            return !perms.TicketPermissions.includes(permission);
        }
        if (perms.DiscordUserId == guildMember.id) {
            return !perms.TicketPermissions.includes(permission);
        }
    }
    return false
}

export async function ticketModalHelper(customId: string, title: string, modalData: ModalData[], interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectMenuInteraction, client: ExtendedClient) {

    const data = modalData
    const modal = new ModalBuilder().setCustomId("ticket-create-modal:" + customId).setTitle(title)
    for (let i = 0; i < 5; i++) {
        const option = data[i];
        if (!option) continue;

        const input = new TextInputBuilder()
            .setCustomId(i.toString())
            .setLabel(option.Name)
            .setStyle(option.Type)
            .setRequired(option.Required);

        if (option.Placeholder) input.setPlaceholder(option.Placeholder);
        if (typeof option.MinLength === 'number') input.setMinLength(option.MinLength);
        if (typeof option.MaxLength === 'number') input.setMaxLength(option.MaxLength);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(input)
        );

        await interaction.showModal(modal)

    }
}