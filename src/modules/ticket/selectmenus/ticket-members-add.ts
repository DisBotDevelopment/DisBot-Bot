import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    Client,
    ContainerBuilder, GuildMember,
    MessageFlags, PermissionFlagsBits,
    PrivateThreadChannel,
    RoleSelectMenuBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize, StringSelectMenuBuilder,
    TextChannel,
    TextDisplayBuilder,
    UserSelectMenuBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-members-add",

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

            if (data.AddedMemberIds.includes(value)) {
                return await ticketErrorMessage("This member was added already!", interaction, client)
            }

            await database.tickets.update({
                where: {
                    TicketId: uuid
                },
                data: {
                    AddedMemberIds: {
                        push: value
                    }
                }
            })
            
            if (data.ChannelType == ChannelType.PrivateThread) {

                await (interaction.channel as PrivateThreadChannel).members.add(value)

                return await interaction.update({
                    flags: MessageFlags.IsComponentsV2,
                    components: [
                        new ContainerBuilder()
                            .addTextDisplayComponents(new TextDisplayBuilder().setContent("Member added to the Thread!"))
                    ]
                })

            } else if (data.ChannelType == ChannelType.GuildCategory) {

                await (interaction.channel as TextChannel).permissionOverwrites.create(value, {
                    ViewChannel: true,
                    SendMessages: true
                })

                return await interaction.update({
                    flags: MessageFlags.IsComponentsV2,
                    components: [
                        new ContainerBuilder()
                            .addTextDisplayComponents(new TextDisplayBuilder().setContent("Member added to the Channel (SendMessages, ViewChannel)"))
                            .addActionRowComponents(
                                new ActionRowBuilder<StringSelectMenuBuilder>()
                                    .addComponents(
                                        new StringSelectMenuBuilder()
                                            .setCustomId("ticket-members-channel-allow:" + value)
                                            .setPlaceholder("Select Allowed Discord Permissions")
                                            .setDisabled(!(await hasTicketPermission("add_extra_channel_perms",  interaction.member as GuildMember, data.TicketId, client) || await hasTicketPermission("all", interaction.member as GuildMember, data.TicketId, client)))
                                            .setMaxValues(23)
                                            .setMinValues(0)
                                            .addOptions([
                                                {
                                                    label: "View Channel",
                                                    value: PermissionFlagsBits.ViewChannel.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Manage Channel",
                                                    value: PermissionFlagsBits.ManageChannels.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Manage Permissions",
                                                    value: PermissionFlagsBits.ManageRoles.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Manage Webhooks",
                                                    value: PermissionFlagsBits.ManageWebhooks.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Create Invite",
                                                    value: PermissionFlagsBits.CreateInstantInvite.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Send Messages",
                                                    value: PermissionFlagsBits.SendMessages.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Send Messages in Thread",
                                                    value: PermissionFlagsBits.SendMessagesInThreads.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Create Thread",
                                                    value: PermissionFlagsBits.CreatePrivateThreads.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Embed Links",
                                                    value: PermissionFlagsBits.EmbedLinks.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Attach Files",
                                                    value: PermissionFlagsBits.AttachFiles.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Add Reactions",
                                                    value: PermissionFlagsBits.AddReactions.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Use External Emojis",
                                                    value: PermissionFlagsBits.UseExternalEmojis.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Use External Stickers",
                                                    value: PermissionFlagsBits.UseExternalStickers.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Mention @everyone, @here and All Roles",
                                                    value: PermissionFlagsBits.MentionEveryone.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Manage Messages",
                                                    value: PermissionFlagsBits.ManageMessages.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Manage Threads",
                                                    value: PermissionFlagsBits.ManageThreads.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Read Message History",
                                                    value: PermissionFlagsBits.ReadMessageHistory.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Send Text-to-speech Messages",
                                                    value: PermissionFlagsBits.SendTTSMessages.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Send Voice Messages",
                                                    value: PermissionFlagsBits.SendVoiceMessages.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Create Polls",
                                                    value: PermissionFlagsBits.SendPolls.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Use Application Commands",
                                                    value: PermissionFlagsBits.UseApplicationCommands.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Use Activities",
                                                    value: PermissionFlagsBits.UseEmbeddedActivities.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Use External Apps",
                                                    value: PermissionFlagsBits.UseExternalApps.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                }
                                            ])
                                    )
                            )
                            .addActionRowComponents(
                                new ActionRowBuilder<StringSelectMenuBuilder>()
                                    .addComponents(
                                        new StringSelectMenuBuilder()
                                            .setCustomId("ticket-members-channel-denied:" + value)
                                            .setPlaceholder("Select Denied Discord Permissions")
                                            .setDisabled(!(await hasTicketPermission("remove_extra_channel_perms",  interaction.member as GuildMember, data.TicketId, client) || await hasTicketPermission("all", interaction.member as GuildMember, data.TicketId, client)))
                                            .setMaxValues(23)
                                            .addOptions([
                                                {
                                                    label: "View Channel",
                                                    value: PermissionFlagsBits.ViewChannel.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Manage Channel",
                                                    value: PermissionFlagsBits.ManageChannels.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Manage Permissions",
                                                    value: PermissionFlagsBits.ManageRoles.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Manage Webhooks",
                                                    value: PermissionFlagsBits.ManageWebhooks.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Create Invite",
                                                    value: PermissionFlagsBits.CreateInstantInvite.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Send Messages",
                                                    value: PermissionFlagsBits.SendMessages.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Send Messages in Thread",
                                                    value: PermissionFlagsBits.SendMessagesInThreads.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Create Thread",
                                                    value: PermissionFlagsBits.CreatePrivateThreads.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Embed Links",
                                                    value: PermissionFlagsBits.EmbedLinks.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Attach Files",
                                                    value: PermissionFlagsBits.AttachFiles.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Add Reactions",
                                                    value: PermissionFlagsBits.AddReactions.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Use External Emojis",
                                                    value: PermissionFlagsBits.UseExternalEmojis.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Use External Stickers",
                                                    value: PermissionFlagsBits.UseExternalStickers.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Mention @everyone, @here and All Roles",
                                                    value: PermissionFlagsBits.MentionEveryone.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Manage Messages",
                                                    value: PermissionFlagsBits.ManageMessages.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Manage Threads",
                                                    value: PermissionFlagsBits.ManageThreads.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Read Message History",
                                                    value: PermissionFlagsBits.ReadMessageHistory.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Send Text-to-speech Messages",
                                                    value: PermissionFlagsBits.SendTTSMessages.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Send Voice Messages",
                                                    value: PermissionFlagsBits.SendVoiceMessages.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Create Polls",
                                                    value: PermissionFlagsBits.SendPolls.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Use Application Commands",
                                                    value: PermissionFlagsBits.UseApplicationCommands.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Use Activities",
                                                    value: PermissionFlagsBits.UseEmbeddedActivities.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                },
                                                {
                                                    label: "Use External Apps",
                                                    value: PermissionFlagsBits.UseExternalApps.toString(),
                                                    emoji: "<:permissions:1277170947761111130>"
                                                }
                                            ])
                                    )
                            )
                    ]
                })


            }


        }
    }
}
