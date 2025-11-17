import {database} from "../main/database.js";
import {
    ActionRowBuilder,
    AnySelectMenuInteraction, AttachmentBuilder,
    BitField, ButtonBuilder,
    ButtonInteraction, ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction, Client, ComponentType, ContainerBuilder, Embed,
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
    TextChannel, TextDisplayBuilder, TextDisplayComponent,
    TextInputBuilder, TextInputStyle,
    ThreadChannel,
    User
} from "discord.js";
import {convertToEmojiToPng} from "./emojis.js";
import {ExtendedClient} from "../types/ExtendedClient.js";
import {randomUUID} from "crypto";
import {cli} from "winston/lib/winston/config/index.js";
import htmlTranscript, {ExportReturnType} from "discord-html-transcripts";
import ticket from "../modules/ticket/commands/ticket.js";
import {replacePlaceholders} from "../main/placeholder.js";
import {Logger} from "../main/logger.js";
import {MessageBuilder} from "./messageHelper.js";
import {sendDefaultMessage} from "./utilityHelper.js";

export async function ticketHelper(
    ticketSetupId: string,
    ticketType: "event" | "interaction",
    client: ExtendedClient,
    interaction?: StringSelectMenuInteraction | ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction,
    modal?: ModalSubmitInteraction,
    messageEvent?: Message,
) {
    try {
        let message: Message
        let guild: Guild;
        let user: GuildMember
        if (ticketType == "event") {
            guild = messageEvent.guild;
            user = messageEvent.member;
        } else if (ticketType == "interaction") {

            await interaction.deferReply({
                flags: MessageFlags.Ephemeral
            })

            if (interaction instanceof ModalSubmitInteraction || interaction instanceof ButtonInteraction || interaction instanceof StringSelectMenuInteraction) {
                message = interaction.message
            }
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
        if (data?.TicketPermissions?.length <= 0) {
            if (ticketType == "event") {
                (messageEvent.channel as TextChannel).send({
                    content: `-# ${await convertToEmojiToPng("ticket")} I can't create a Ticket without Moderators `
                }).then(async (m) => {
                    setTimeout(async () => {
                        await m.delete()
                    }, 5000)
                })
                return;
            } else if (ticketType == "interaction") {
                await interaction.editReply({
                    content: `-# ${await convertToEmojiToPng("ticket")} I can't create a Ticket without Moderators `
                })
                return;
            }
        }

        // Check Rate Limit
        if (data.TicketRateLimit) {
            const channel = await guild.channels.fetch(data.TicketStatusChannelId) as GuildTextBasedChannel
            const message = await channel.messages.fetch(data.TicketStatusMessageId)
            const allTicketsFromComponentCount = (await database.tickets.findMany({
                where: {
                    TicketSetupId: data.CustomId,
                    IsClosed: false
                }
            })).length
            if (!message) {
            }

            const current = allTicketsFromComponentCount
            const greenState = Number(data.TicketRateLimit.split(",")[0])
            const yellowState = Number(data.TicketRateLimit.split(",")[1])
            const redState = Number(data.TicketRateLimit.split(",")[2])

            const statusMessageTemplate = await database.messageTemplates.findFirst({
                where: {
                    Name: data.TicketStatusMessageTemplateId
                }
            })
            if (!statusMessageTemplate) {
            }
            if (message.author.id != client.user.id) {
            }

            const ticketPlaceholderType = {
                ticket: {
                    status: {
                        current: (await checkTicketStatus(current, greenState, yellowState, redState, client)).current,
                        green: (await checkTicketStatus(current, greenState, yellowState, redState, client)).green,
                        yellow: (await checkTicketStatus(current, greenState, yellowState, redState, client)).yellow,
                        red: (await checkTicketStatus(current, greenState, yellowState, redState, client)).red,
                    }
                }
            }

            const messageBuilder = await MessageBuilder(
                statusMessageTemplate,
                ticketPlaceholderType
            )

            await message.edit(messageBuilder.messageData)

            if (allTicketsFromComponentCount >= redState) {
                if (ticketType == "event") {
                    (messageEvent.channel as TextChannel).send({
                        content: `-# ${await convertToEmojiToPng("sirenred")} At the moment our support team is busy!`
                    }).then(async (m) => {
                        setTimeout(async () => {
                            await m.delete()
                        }, 5000)
                    })
                    return;
                } else if (ticketType == "interaction") {
                    await interaction.editReply({
                        content: `-# ${await convertToEmojiToPng("sirenred")} At the moment our support team is busy! Please wait for a ${await convertToEmojiToPng("sirengreen")}, ${await convertToEmojiToPng("sirenyellow")} status!`
                    })
                    return;
                }
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
                        content: `-# ${await convertToEmojiToPng("ticket")} You only can open Tickets from ${startStr}-${endStr}!`
                    }).then(async (m) => {
                        setTimeout(async () => {
                            await m.delete()
                        }, 5000)
                    })
                    return;
                } else if (ticketType == "interaction") {
                    await interaction.editReply({
                        content: `-# ${await convertToEmojiToPng("ticket")} You only can open Tickets from ${startStr}-${endStr}!`
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
                            content: `-# ${await convertToEmojiToPng("ticket")} You are blacklisted for this Ticket!`
                        }).then(async (m) => {
                            setTimeout(async () => {
                                await m.delete()
                            }, 5000)
                        })
                        return;
                    } else if (ticketType == "interaction") {
                        await interaction.editReply({
                            content: `-# ${await convertToEmojiToPng("ticket")} You are blacklisted for this Ticket!`
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
                    const emoji = await convertToEmojiToPng("timer");
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
                        content: `-# ${await convertToEmojiToPng("ticket")} You need one of the Required Roles! \n > -# ${data.RequiredRoles.map((r) => `<@&${r}>`).join(", ")}`
                    }).then(async (m) => {
                        setTimeout(async () => {
                            await m.delete()
                        }, 5000)
                    })
                    return;
                } else if (ticketType == "interaction") {
                    await interaction.editReply({
                        content: `-# ${await convertToEmojiToPng("ticket")} You need one of the Required Roles! \n > -# ${data.RequiredRoles.map((r) => `<@&${r}>`).join(", ")}`
                    })
                    return;
                }
            }
        }

        // TicketLimit
        if (data.TicketLimit) {
            const openTicketsPerUser = await database.tickets.findMany({
                where: {
                    TicketSetupId: ticketSetupId,
                    IsClosed: false,
                    GuildId: guild.id,
                    TicketOwnerId: user.id
                }
            })

            if (openTicketsPerUser.length >= data.TicketLimit) {
                if (ticketType == "event") {
                    (messageEvent.channel as TextChannel).send({
                        content: `-# ${await convertToEmojiToPng("ticket")} You have reached the ticket limit! You can only open ${data.TicketLimit} more tickets.`
                    }).then(async (m) => {
                        setTimeout(async () => {
                            await m.delete()
                        }, 5000)
                    })
                    return;
                } else if (ticketType == "interaction") {
                    return await interaction.editReply({
                        content: `-# ${await convertToEmojiToPng("ticket")} You have reached the ticket limit! You can only open ${data.TicketLimit} more tickets.`
                    })
                }
            }
        }

        let messageData = await database.messageTemplates.findFirst({
            where: {
                Name: data?.MessageTemplateId?.length >= 2 ? data.MessageTemplateId : ""
            }
        })

        if (!messageData) {
            const ticketTemplateMessage = await fetch("https://cdn.xyzhub.link/raw/VqvWD9.json?download=true")
            const ticketTemplateMessageData = await ticketTemplateMessage.json()

            messageData = {
                Id: Number(Math.random() * 134324),
                GuildId: guild.id,
                Content: null,
                ComponentJSON: null,
                IsComponentsV2Message: false,
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

        // Pre Permissions
        if (IsChannel) await (channel as TextChannel).permissionOverwrites.create(user.id, {
            ViewChannel: true,
            SendMessages: true
        });
        if (IsThread) await (channel as ThreadChannel).members.add(user.id)

        // Ticket Permissions
        if (data.TicketPermissions) {
            // Channel Perms
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
            // Thread Perms
            if (IsThread) {
                for (const perms of data.TicketPermissions) {
                    if (perms.DiscordRoleId) {
                        // "MEMBER PING" - I will not fetch the Role and add the member because of Discord Rate Limits and so on...
                        const discordRolePingMessage = await channel.send(`<@&${perms.DiscordRoleId}>`)
                        await discordRolePingMessage.delete()
                    } else if (perms.DiscordUserId) {
                        await (channel as ThreadChannel).members.add(perms.DiscordUserId)
                    }
                }
            }

            // Shadow Ping
            for (const perms of data.TicketPermissions) {
                if (perms.HasShadowPing) {
                    // Thread
                    // Threads cannot have shadow pings because I add the member from the role, and this pings the member!

                    // Channel
                    if (IsChannel && perms.DiscordRoleId) {
                        await channel.send({
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

        const ticketMessage = await MessageBuilder(
            messageData,
            ticketPlaceholderType
        )
        await channel.send(ticketMessage.messageData)

        let autoHandler: string

        if (data.AutoAssignHandler) {
            const role = guild.roles.cache.get(data.AutoAssignHandler)
            if (!role) {
                return
            }
            const randomNum = Math.random() * role.members.size

            autoHandler = role.members[randomNum].id
        }

        if (!data.TicketSettings.includes("disable_actions_button")) {
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
        }

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

        // Refresh the Message to reuse the options - is need because discord not do it... (AHAAHAH)
        if (message) {
            await message.edit({
                content: message.content
            })
        }

        if (ticketType == "event") {
            (messageEvent.channel as TextChannel).send({
                allowedMentions: {
                    repliedUser: false,
                },
                content: `-# ${await convertToEmojiToPng("ticket")} Your ticket has beed created here ${channel.url}`
            }).then(async (m) => {
                setTimeout(async () => {
                    await m.delete()
                }, 5000)
            })
            return;
        } else if (ticketType == "interaction") {
            await interaction.editReply({
                content: `-# ${await convertToEmojiToPng("ticket")} Your ticket has beed created here ${channel.url}`
            })
            return;
        }
    } catch (e) {
        Logger.error(`Ticket Error: ${e}`)
        if (ticketType == "event") {
            (messageEvent.channel as TextChannel).send({
                allowedMentions: {
                    repliedUser: false,
                },
                content: `-# ${await convertToEmojiToPng("ticket")} Please wait a moment and try again.`
            }).then(async (m) => {
                setTimeout(async () => {
                    await m.delete()
                }, 5000)
            })
            return;
        } else if (ticketType == "interaction") {
            await interaction.editReply({
                content: `-# ${await convertToEmojiToPng("ticket")} Please wait a moment and try again.`
            })
            return;
        }
    }
}

export async function ticketErrorMessage(message: string, interaction: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction, client: ExtendedClient) {
    return await interaction.reply({
        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        components: [
            new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`## ${await convertToEmojiToPng("error")} Your ticket action failed with: ${message}`)
                )
        ]
    })
}

export async function handleCloseAction(client: ExtendedClient, guild: Guild, channel: TextChannel | PrivateThreadChannel, ticketId: string, confirm?: boolean, reason?: string, isAuto?: boolean, interaction?: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction) {


    if (!isAuto && !interaction.deferred) await interaction.deferReply({flags: MessageFlags.Ephemeral})
    const actionData: {
        type: string,
        message: string,
    }[] = [
        {
            message: "Ticket Close Action Started.",
            type: "general"
        }
    ]

    const data = await database.tickets.findFirst({
        include: {
            TicketSetup: true
        },
        where: {
            TicketId: ticketId
        }
    })
    if (!data && interaction) {
        return await ticketErrorMessage("No Data!", interaction, client)
    }

    await database.tickets.update({
        where: {
            TicketId: ticketId
        },
        data: {
            IsClosed: true,
            IsAutoDone: isAuto ?? false,
            ClosedAt: new Date
        }
    })

    // Default Ticket Close Actions
    const owner = await guild.members.fetch(data.TicketOwnerId)
    const actions = data.AutoCloseAction

    if (actions.includes("confirm") && !confirm && !isAuto) {
        return await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [

                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent("-# **You need to confirm your action**")
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-close-action-confirm:" + ticketId)
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Confirm")
                                .setEmoji("<:check:1320090167444377713>")
                        )
                    )
            ]
        })
    }
    if (actions.includes("reason") && !reason && !isAuto) {
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

    // Check Rate Limit
    if (data.TicketSetup.TicketRateLimit) {

        actionData.push({
            type: "ratelimit",
            message: "Updated Rate Limit Message"
        })

        const channel = await guild.channels.fetch(data.TicketSetup.TicketStatusChannelId) as GuildTextBasedChannel
        const message = await channel.messages.fetch(data.TicketSetup.TicketStatusMessageId)
        const allTicketsFromComponentCount = (await database.tickets.findMany({
            where: {
                TicketSetupId: data.TicketSetup.CustomId,
                IsClosed: false
            }
        })).length
        if (!message) {
            return
        }

        const current = allTicketsFromComponentCount
        const greenState = Number(data.TicketSetup.TicketRateLimit.split(",")[0])
        const yellowState = Number(data.TicketSetup.TicketRateLimit.split(",")[1])
        const redState = Number(data.TicketSetup.TicketRateLimit.split(",")[2])

        const statusMessageTemplate = await database.messageTemplates.findFirst({
            where: {
                Name: data.TicketSetup.TicketStatusMessageTemplateId
            }
        })
        if (!statusMessageTemplate) {
            return
        }
        if (message.author.id != client.user.id) {
            return
        }

        const ticketPlaceholderType = {
            ticket: {
                status: {
                    current: (await checkTicketStatus(current, greenState, yellowState, redState, client)).current,
                    green: (await checkTicketStatus(current, greenState, yellowState, redState, client)).green,
                    yellow: (await checkTicketStatus(current, greenState, yellowState, redState, client)).yellow,
                    red: (await checkTicketStatus(current, greenState, yellowState, redState, client)).red,
                }
            }
        }

        const messageBuilder = await MessageBuilder(
            statusMessageTemplate,
            ticketPlaceholderType
        )
        await message.edit(messageBuilder.messageData)
    }

    // Default Ticket Close Actions
    if (data.UserDMWhenCloseMessageTemplateId) {
        actionData.push({
            type: "closedm",
            message: "Requested DM for User..."
        })

        const messageData = await database.messageTemplates.findFirst({
            where: {
                Name: data.UserDMWhenCloseMessageTemplateId
            }
        })

        const claimedUser = data.UserWhoHasClaimedId ? (await guild.members.fetch(data.UserWhoHasClaimedId)).user.username : "N/A"
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
                reason: reason ?? "N/A",
                isClosed: data.IsClosed,
                isClaimed: data.IsClaimed,
                userWhoHasClaimedId: data.UserWhoHasClaimedId,
                userWhoHasClaimedTag: `<@${data.UserWhoHasClaimedId}>`,
                userWhoHasClaimedName: claimedUser,
                isLocked: data.IsLocked,
                isArchived: data.IsArchived,
            },
        }

        await owner.createDM(true)
        const messageBuilder = await MessageBuilder(
            messageData,
            ticketPlaceholderType
        )

        try {
            await owner.send(messageBuilder.messageData)
            await owner.send({
                content: `-# Message from ${channel.guild.name}. Ticket Closed with ID ${ticketId}.`,
            })
            actionData.push({
                type: "closedm-success",
                message: "Sent to user successfully.",
            })
        } catch (e) {
            actionData.push({
                type: "closedm-error",
                message: "Can't send DM for User (SKIP)"
            })
        }
    }
    if (data.WithTicketFeedback) {
        actionData.push({
            type: "feedback",
            message: "Sent Ticket Feedback Message."
        })

        await owner.createDM(true)
        await owner.send({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            [
                                `## ${await convertToEmojiToPng("star")} Feedback`,
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
        actionData.push({
            type: "usertranscript",
            message: "Exported Transcript to Ticket Owner"
        })

        const userTranscript = await ticketTranscriptBuilder(
            ticketId,
            client,
            guild,
            channel,
            null,
            null
        )
        await owner.createDM(true)
        await owner.send(userTranscript as any)
        await owner.send({
            content: `-# Message from ${interaction.guild.name}. Transcript sent from ticket with ID ${ticketId}.`,
        })

    }
    if (actions.includes("look")) {
        actionData.push({
            type: "look",
            message: "Looked Ticket successfully."
        })

        await ticketLookAction(
            channel,
            client,
            ticketId,
            true,
            interaction ? interaction : null,
            isAuto ?? null
        )
    }
    if (actions.includes("archive")) {
        actionData.push({
            type: "archive",
            message: "Ticket has beed archived."
        })

        await ticketArchiveAction(
            channel,
            client,
            ticketId,
            true,
            interaction ? interaction : null,
        )
    }
    if (actions.includes("channel")) {
        actionData.push({
            type: "channel",
            message: "Channel has beed looked!"
        })

        await ticketLookAction(
            channel,
            client,
            ticketId,
            true,
            interaction ? interaction : null,
            isAuto ?? null
        )
    }
    if (actions.includes("remove_user_from_ticket")) {
        actionData.push({
            type: "remove_user_from_ticket",
            message: "Removed user from ticket."
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
    if (data.OldTicketCategoryId) {
        actionData.push({
            type: "movechannel",
            message: `Moved Channel to <#${data.OldTicketCategoryId}>`
        })

        if (data.ChannelType == ChannelType.PrivateThread) return
        await (channel as TextChannel).setParent(data.OldTicketCategoryId)
    }
    if (!actions.includes("no_close_message")) {
        actionData.push({
            type: "no_close_message",
            message: "Skip Close Message for ticket."
        })

        await channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`### ${await convertToEmojiToPng("ticket")} Ticket has been closed!${reason ? `\n> ### ${await convertToEmojiToPng("info")} ***Reason: ${reason}***` : ``}`)
                    )
            ]
        })
    }
    if (data.TranscriptChannelId) {
        actionData.push({
            type: "transcript-created",
            message: "Exported Ticket-Transcript to Channel."
        })

        const tChannel = await guild.channels.fetch(data.TranscriptChannelId) as TextChannel | PrivateThreadChannel
        if (tChannel) {
            const transcript = await ticketTranscriptBuilder(
                ticketId,
                client,
                guild,
                channel,
                null,
                null
            )

            await tChannel.send(transcript as any)

            actionData.push({
                type: "transcript-sent",
                message: "Successfully exported Transcript."
            })
        }
    }

    if (!isAuto) {
        const permission = (await hasTicketPermission("close_result", interaction.user as unknown as GuildMember, data.TicketId, client) || await hasTicketPermission("all", interaction.user as unknown as GuildMember, data.TicketId, client))

        if (permission)
            await sendDefaultMessage(
                [
                    `## ${await convertToEmojiToPng("ticket")} Ticket Result.`,
                    `-# Ticket has been closed successfully.`,
                    ``,
                    `**Ticket Action Log**`,
                    `${actionData.map((a) => `-# **${a.type}**: ${a.message}`).join("\n")}`
                ].join("\n"),
                interaction,
                true,
                "deferReply")
        else await sendDefaultMessage(
            [
                `-# ${await convertToEmojiToPng("ticket")} Ticket has been closed!`,
            ].join("\n"),
            interaction,
            true,
            "deferReply")
    }

    // To save that the ticket will be closed.
    if (!actions.includes("not_thread_close")) {
        if (data.ChannelType == ChannelType.PrivateThread) {
            /*      
            actionData.push({
                type: "not_thread_close",
                message: "Skip Ticket Close for thread"
            })
            */
            await (channel as ThreadChannel).setArchived(true, "Moderator Action from Ticket with Id " + ticketId)
        }
    }

    // To prevent errors, execute at the end!
    if (actions.includes("delete")) {
        await interaction.channel.delete(`Ticket Close action by ${interaction.user.username} (${interaction.user.id})`)
    }
}

export async function ticketArchiveAction(channel: TextChannel | PrivateThreadChannel, client: ExtendedClient, ticketId: string, isClose?: boolean, interaction?: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction) {
    const uuid = ticketId

    const data = await database.tickets.findFirst({
        include: {
            TicketSetup: true
        },
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

    const message = await channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [
            new ContainerBuilder()

                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${await convertToEmojiToPng("package")} Ticket has been archived.\n-# Manage the Ticket with the ${await convertToEmojiToPng("ticket")} -Button.`))
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

    if (data.ChannelType == ChannelType.PrivateThread) {

        if (!data.TicketSetup.AutoCloseAction.includes("not_thread_close")) {
            await (channel as ThreadChannel).setArchived(true, "Moderator Action from Ticket with Id " + ticketId)
        }

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
}

export async function ticketLookAction(channel: TextChannel | PrivateThreadChannel, client: ExtendedClient, ticketId: string, isClose?: boolean, interaction?: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction, isAuto?: boolean) {
    const uuid = ticketId
    const data = await database.tickets.findFirst({
        where: {
            TicketId: uuid
        }
    })

    if (!data && !isAuto && interaction != null) {
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
                        new TextDisplayBuilder().setContent(`### ${await convertToEmojiToPng("ticket")} ${interaction.user} has unlocked the ticket.`)
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

        if (!isAuto && !isClose) await interaction.reply({
            content: `## ${await convertToEmojiToPng("lockopen")} You unlocked the Ticket successfully!`,
            flags: MessageFlags.Ephemeral,
        })
        return
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
                    new TextDisplayBuilder().setContent(`### ${await convertToEmojiToPng("ticket")} ${interaction?.user ?? "System"} has locked the ticket.`)
                )
        ]
    })
    if (!isClose && !isAuto) {
        return await interaction.reply({
            content: `## ${await convertToEmojiToPng("lock")} You locked the Ticket successfully! Unlock the ticket with a new Click.`,
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

    let rawBuffer;

    const messages = await channel.messages.fetch()

    messages.map((m) => {
        if (m.components.length > 0 && m.flags.has(MessageFlags.IsComponentsV2)) {
            m.components = [m.components[0]]
            m.content = `${m.content}\n\n\n**Removed Components for this Transcript because of Components V2 Bugs.**`
        }
        return m
    })

    try {
        // @ts-ignore
        rawBuffer = await htmlTranscript.generateFromMessages(messages,
            channel,
            {
                limit: -1,
                poweredBy: false,
                favicon: 'guild',
                filename: `transcript-${data.TicketId}-${data.TicketOwnerId}.html`,
                footerText: '',
                saveImages: false,
                returnType: ExportReturnType.Buffer,
            });
    } catch (e) {
        console.log(e)
    }

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
                            `## ${await convertToEmojiToPng("ticket")} Ticket-Transcript Export`,
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

    if (!interaction.deferred) await interaction.deferReply({
        flags: MessageFlags.Ephemeral,
    })

    const data = await database.tickets.findFirst({
        where: {
            TicketId: ticketId
        }
    })

    const member = interaction.member as GuildMember;

    const permissions = {
        delete: await hasTicketPermission("delete", member, data.TicketId, client),
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

    await interaction.editReply({
        flags: MessageFlags.IsComponentsV2,
        components: [
            new ContainerBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### **${await convertToEmojiToPng("ticket")} Manage the Ticket with the buttons you see.**`))
                .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ticket-close:${ticketId}`)
                        .setLabel("Close Ticket")
                        .setEmoji("<:x_:1322169218682322955>")
                        .setDisabled(!(permissions.close || permissions.all))
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId(`ticket-delete:${ticketId}`)
                        .setLabel("Delete Ticket")
                        .setEmoji("<:trash:1259432932234367069>")
                        .setDisabled(!(permissions.delete || permissions.all))
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
                ))
                .addActionRowComponents(
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`ticket-transcript:${ticketId}`)
                            .setLabel("Transcript Ticket")
                            .setEmoji("<:file:1381000301124911134>")
                            .setDisabled(!(permissions.transcript || permissions.all))
                            .setStyle(ButtonStyle.Secondary),

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
                            .setCustomId(`ticket-notes:${ticketId}`)
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

export const ticketActionsPermissions = [
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
        label: "Close Result",
        description: "Show the Ticket Close Result (Actions...)",
        value: "close_result",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Delete",
        value: "delete",
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

export const ticketSettings = [
    {
        label: "Disable Ticket Actions Button",
        value: "disable_actions_button",
        emoji: "<:button:1327305176553492520>"
    },
]

export const ticketCloseAction = [
    {
        label: "Look Ticket (Thread)",
        value: "look",
        emoji: "<:threads:1298014776965857372>"
    },
    {
        label: "Archive (Both)",
        value: "archive",
        emoji: "<:threds:1395716084870549575>"
    },
    {
        label: "Move to Old Ticket Category (Channel)",
        value: "channel",
        emoji: "<:text:1395716083452874826>"
    },
    {
        label: "Delete the Ticket (Both)",
        value: "delete",
        emoji: "<:threds:1395716084870549575>"
    },
    {
        label: "With Confirm Message (Both)",
        value: "confirm",
        emoji: "<:threds:1395716084870549575>"
    },
    {
        label: "Remove user from Ticket Close (Both)",
        value: "remove_user_from_ticket",
        emoji: "<:threds:1395716084870549575>"
    },
    {
        label: "No Close Message (Both)",
        value: "no_close_message",
        emoji: "<:threds:1395716084870549575>"
    },
    {
        label: "Not \"Close\" Thread (Thread)",
        value: "not_thread_close",
        emoji: "<:threds:1395716084870549575>"
    },
    {
        label: "Require Reason (Both)",
        value: "reason",
        emoji: "<:threds:1395716084870549575>"
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
    const guildMember = await (await client.guilds.fetch(data.GuildId)).members.fetch(user.id)


    for (const perms of data.TicketSetup.TicketPermissions) {
        if (guildMember.roles.cache.has(perms.DiscordRoleId)) {
            return perms.TicketPermissions.includes(permission);
        }
        if (perms.DiscordUserId == guildMember.id) {
            return perms.TicketPermissions.includes(permission);
        }
    }
    return false
}

export async function ticketModalHelper(customId: string, title: string, modalData: any, interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectMenuInteraction, client: ExtendedClient) {

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

async function checkTicketStatus(currentTickets: number, green: number, yellow: number, red: number, client: ExtendedClient) {
    const greenEmoji = await convertToEmojiToPng("sirengreen")
    const yellowEmoji = await convertToEmojiToPng("sirenyellow")
    const redEmoji = await convertToEmojiToPng("sirenred")

    let status = {
        current: "ㅤ",
        green: "ㅤ",
        yellow: "ㅤ",
        red: "ㅤ"
    }

    if (currentTickets == 0) {
        status = {
            current: greenEmoji,
            green: greenEmoji,
            yellow: status.yellow,
            red: status.red
        }
    }

    if (currentTickets <= green && currentTickets <= yellow) {
        status = {
            current: greenEmoji,
            green: greenEmoji,
            yellow: status.yellow,
            red: status.red
        }
    }
    if (currentTickets >= green && currentTickets <= yellow && currentTickets <= red) {
        status = {
            current: yellowEmoji,
            green: status.green,
            yellow: yellowEmoji,
            red: status.red
        }
    }
    if (currentTickets >= yellow && currentTickets <= red) {
        status = {
            current: redEmoji,
            green: status.green,
            yellow: status.yellow,
            red: redEmoji
        }
    }

    return status
}