import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType,
    Client,
    ContainerBuilder,
    MessageFlags, PermissionFlagsBits,
    StringSelectMenuBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";
import {ticketActionsPermissions} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-add-component-permission-role",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const value of interaction.values) {

            const uuid = randomUUID();
            const data = await database.ticketSetups.findFirst(
                {
                    where: {
                        CustomId: interaction.customId.split(":")[1]
                    }
                }
            )

            const isRoleInDB = await database.ticketPermissions.findFirst({
                where: {
                    TicketSetupId: interaction.customId.split(":")[1],
                    DiscordRoleId: value
                }
            })
            if (isRoleInDB) {
                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} This Role is used please delete the entry!`
                })
            }

            if (!data.ChannelType) {
                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} Please first select a Channel Type`
                })
            }

            const role = interaction.guild.roles.cache.get(value);
            await database.ticketPermissions.create(
                {
                    data: {
                        TicketSetupId: interaction.customId.split(":")[1],
                        UUID: uuid,
                        DiscordRoleId: role.id,
                        TicketPermissions: [],
                        HasShadowPing: false,
                        DiscordUserId: null,

                    }
                }
            );

            await interaction.reply({
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder()
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-permission-shadow-ping:" + uuid)
                                    .setLabel("Enable Shadow ping in Ticket")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji("<:ping:1232483669218955374>"),
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-permission-is-handler:" + uuid)
                                    .setLabel("Is Ticket Mod (Need to create a Ticket)")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji("<:Mod_Shield:1279080247387619369>")
                            )
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<StringSelectMenuBuilder>()
                                .addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId("ticket-add-component-permission-ticket:" + uuid)
                                        .setPlaceholder("Select Ticket Permissions")
                                        .setMaxValues(ticketActionsPermissions.length)
                                        .setMinValues(0)
                                        .addOptions(ticketActionsPermissions)
                                )
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<StringSelectMenuBuilder>()
                                .addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId("ticket-add-component-permission-allowed:" + uuid)
                                        .setPlaceholder("Select Allowed Discord Permissions")
                                        .setDisabled(data.ChannelType === ChannelType.PrivateThread)
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
                                        .setCustomId("ticket-add-component-permission-denied:" + uuid)
                                        .setPlaceholder("Select Denied Discord Permissions")
                                        .setDisabled(data.ChannelType === ChannelType.PrivateThread)
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
                ]
            });
        }
    }
};
