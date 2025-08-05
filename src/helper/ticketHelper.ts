import {database} from "../main/database.js";
import {
    ActionRowBuilder,
    AnySelectMenuInteraction,
    BitField, ButtonBuilder,
    ButtonInteraction, ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction, ContainerBuilder,
    EmbedBuilder,
    Guild,
    GuildMember,
    Message,
    MessageFlags,
    ModalBuilder,
    ModalSubmitInteraction,
    PermissionsBitField,
    PermissionsString,
    PrivateThreadChannel, Role,
    StringSelectMenuInteraction,
    TextChannel, TextDisplayBuilder,
    TextInputBuilder,
    ThreadChannel,
    User
} from "discord.js";
import {convertToEmojiPng} from "./emojis.js";
import {ExtendedClient} from "../types/client.js";
import {ModalData} from "../types/ticket.js";
import {randomUUID} from "crypto";
import {cli} from "winston/lib/winston/config/index.js";

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
        return;
    } else {
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
                await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `-# ${await convertToEmojiPng("ticket", client.user.id)} You only can open Tickets from ${startStr}-${endStr}!`
                }).then(async (i) => {
                    setTimeout(async () => {
                        await i.delete()
                    }, 5000)
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
                    await interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        content: `-# ${await convertToEmojiPng("ticket", client.user.id)} You are blacklisted for this Ticket!`
                    }).then(async (i) => {
                        setTimeout(async () => {
                            await i.delete()
                        }, 5000)
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
    if (data.RequiredRoles) {
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
                await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `-# ${await convertToEmojiPng("ticket", client.user.id)} You need one of the Required Roles! \n > -# ${data.RequiredRoles.map((r) => `<@&${r}>`).join(", ")}`
                }).then(async (i) => {
                    setTimeout(async () => {
                        await i.delete()
                    }, 5000)
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
                await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `-# ${await convertToEmojiPng("ticket", client.user.id)} You have reached the ticket limit! You can only open ${data.TicketLimit} more tickets.`
                }).then(async (i) => {
                    setTimeout(async () => {
                        await i.delete()
                    }, 5000)
                })
                return;
            }
        }

    }

    const messageData = await database.messageTemplates.findFirst({
        where: {
            Name: data.MessageTemplateId
        }
    })

    function ticketPlaceholderHelper(stringToReplace: string,) {
        return stringToReplace.replaceAll(
            "{member.name}", user.user.username
        ).replaceAll("{member.username}", user.user.username)
            .replaceAll("{modal.option.1}", modal?.fields?.getTextInputValue("0") ?? "N/A")
            .replaceAll("{modal.option.2}", modal?.fields?.getTextInputValue("1") ?? "N/A")
            .replaceAll("{modal.option.3}", modal?.fields?.getTextInputValue("2") ?? "N/A")
            .replaceAll("{modal.option.4}", modal?.fields?.getTextInputValue("3") ?? "N/A")
            .replaceAll("{modal.option.5}", modal?.fields?.getTextInputValue("4") ?? "N/A")
    }

    const category = await guild.channels.fetch(data.CategoryId)
    let channel: TextChannel | ThreadChannel
    const IsThread = data.ChannelType == ChannelType.PrivateThread
    const IsChannel = data.ChannelType == ChannelType.GuildCategory
    if (data.ChannelType == ChannelType.GuildCategory) {
        channel = await guild.channels.create({
            name: ticketPlaceholderHelper(data.TicketChannelName),
            parent: category.id,
            type: ChannelType.GuildText
        })
    } else if (data.ChannelType == ChannelType.PrivateThread) {
        channel = await (category as TextChannel).threads.create({
            name: ticketPlaceholderHelper(data.TicketChannelName),
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
            content: messageData.Content ?? null,
            embeds: [
                new EmbedBuilder(JSON.parse(messageData.EmbedJSON))
            ]
        })
    } else {
        await channel.send({
            content: messageData.Content ?? null,
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

    const ticketId = randomUUID()
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
}

export async function ticketActionsHelper(client: ExtendedClient, ticketId: string, interaction: ButtonInteraction | ChatInputCommandInteraction) {

    const data = await database.tickets.findFirst({
        where: {
            TicketId: ticketId
        }
    })

    await interaction.reply({
        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        components: [
            new TextDisplayBuilder().setContent(`> **${await convertToEmojiPng("ticket", client.user.id)} Manage the Ticket with the buttons you see.**`),
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("ticket-close")
                    .setLabel("Close Ticket")
                    .setEmoji("<:x_:1322169218682322955>")
                    .setDisabled(await (hasTicketPermission("close", (interaction.user as unknown as GuildMember), data.TicketId, client)))
                    .setStyle(ButtonStyle.Secondary)
            )
        ]
    })
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
        label: "View Notes",
        value: "notes",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "View Infos",
        value: "infos",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Un-/Look Channel",
        value: "look",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Remove user from Ticket if Close",
        value: "remove_user_from_ticket",
        emoji: "<:permissions:1277170947761111130>"
    },
    {
        label: "Require Reason",
        value: "reason",
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
    return true
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