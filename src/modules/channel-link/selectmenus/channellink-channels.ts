import {
    ActionRowBuilder,
    AnySelectMenuInteraction,
    ButtonBuilder,
    ButtonStyle, ContainerBuilder, GuildTextBasedChannel,
    MessageFlags,
    ModalBuilder,
    PermissionFlagsBits, StringSelectMenuBuilder, TextBasedChannel, TextChannel, TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {DisBotInteractionType} from "../../../enums/disBotInteractionType.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "channellink-channels",
    type: DisBotInteractionType.SelectMenu,
    options: {
        once: false,
        cooldown: 3000, // 3 seconds
        botPermissions: [],
        userPermissions: [PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false
    },

    /**
     * @param {AnySelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: AnySelectMenuInteraction, client: ExtendedClient
    ) {
        try {
            await interaction.deferReply({
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            })

            for (const value of interaction.values) {

                const channel = interaction.guild.channels.cache.get(value) as TextChannel

                let data = await database.guildChannelLinks.findFirst({
                    where: {
                        ChannelId: value,
                        GuildId: interaction.guild.id
                    }
                })

                const uuid = randomUUID()

                if (!data) {
                    const webhook = await channel.createWebhook({
                        name: `Channel Link Webhook - ${interaction.guild.name}`,
                        avatar: interaction.guild.iconURL(),
                        reason: "Created a Channel-Link "
                    })

                    await database.guildChannelLinks.create({
                        data: {
                            Guilds: {
                                connect: {
                                    GuildId: interaction.guild.id
                                }
                            },
                            ChannelId: value,
                            SyncFlags: [],
                            LinkedWith: [],
                            WebhookUrl: webhook.url,
                            UUID: uuid
                        }
                    })
                    data = await database.guildChannelLinks.findFirst({
                        where: {
                            ChannelId: value,
                            GuildId: interaction.guild.id
                        }
                    })
                }

                const channelWebhooks = await channel.fetchWebhooks()
                const getWebhook = channelWebhooks.find((w) => w.url == data.WebhookUrl)

                if (!getWebhook) {
                    const webhook = await channel.createWebhook({
                        name: `Channel Link Webhook - ${interaction.guild.name}`,
                        avatar: interaction.guild.iconURL(),
                        reason: "Created a Channel-Link "
                    })

                    await database.guildChannelLinks.update({
                        where: {
                            ChannelId: value,
                            GuildId: interaction.guild.id
                        },
                        data: {
                            WebhookUrl: webhook.url
                        }
                    })
                    data = await database.guildChannelLinks.findFirst({
                        where: {
                            ChannelId: value,
                            GuildId: interaction.guild.id
                        }
                    })
                }

                if (!data.UsersCanSelectIds.includes(interaction.user.id)) {
                    await database.guildChannelLinks.update({
                        where: {
                            ChannelId: value,
                            GuildId: interaction.guild.id
                        },
                        data: {
                            UsersCanSelectIds: {
                                push: interaction.user.id
                            }
                        }
                    })
                    data = await database.guildChannelLinks.findFirst({
                        where: {
                            ChannelId: value,
                            GuildId: interaction.guild.id
                        }
                    })
                }

                const allUserChannels = await database.guildChannelLinks.findMany({
                    where: {
                        UsersCanSelectIds: {
                            has: interaction.user.id
                        }
                    }
                })

                if (allUserChannels.length >= 25) {
                    return await interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        content: `## ${await convertToEmojiToPng("error")} You have more then 25 Channel Links try to remove one!\n-# You only see this because of discords limits if you need more please [DM](https://discord.com/users/850470027026759690) me! `
                    })
                }

                const channels = []
                for (const linkId of data.LinkedWith) {
                    const linkData = await database.guildChannelLinks.findFirst({
                        where: {
                            UUID: linkId
                        }
                    })
                    channels.push(linkData.ChannelId)
                }

                await interaction.editReply({
                    flags: MessageFlags.IsComponentsV2,
                    components: [
                        new ContainerBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(
                                        [
                                            `## ${await convertToEmojiToPng("cable")} Manage ${interaction.channel} Channel-Link`,
                                            ``,
                                            `> Select up to 25 Channels from you List to Sync Messages from this Channel to the other.`,
                                            `> Select what Flags can be send and select some settings.`,
                                            ``,
                                            `> **Selected Channels**: ${channels.map((c) => ` <#${c}>`)}`,
                                            `> **Selected Flags**: ${data.SyncFlags.map((c) => ` \`${c}\``)}`,
                                            ``
                                        ].join("\n")
                                    )
                            )
                            .addActionRowComponents(
                                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId("channel-link-linkedwith:" + data.UUID)
                                        .setPlaceholder("Select Channels to link with")
                                        .setMaxValues(allUserChannels.length)
                                        .setMinValues(0)
                                        .addOptions(allUserChannels.map((link) => {
                                                return {
                                                    value: link.UUID,
                                                    label: (client.channels.cache.get(link.ChannelId) as GuildTextBasedChannel).name,
                                                    emoji: "<:text:1395716083452874826>",
                                                    description: `Select channel to send messages in it.`
                                                }
                                            }
                                        ))
                                )
                            )
                            .addActionRowComponents(
                                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId("channel-link-flags:" + data.UUID)
                                        .setPlaceholder("Select Channel-Link Flags to setups settings")
                                        .setMaxValues(7)
                                        .setMinValues(0)
                                        .addOptions(
                                            [
                                                {
                                                    value: "send_all",
                                                    label: "Send All to the Channel",
                                                    emoji: "<:add:1260157236043583519>",
                                                    description: `Send all Message Types and options!`
                                                },
                                                {
                                                    value: "no_attachments",
                                                    label: "Not Send Attachments",
                                                    emoji: "<:add:1260157236043583519>",
                                                    description: `Send all Message Types and options!`
                                                },
                                                {
                                                    value: "no_embeds",
                                                    label: "Not Send Embeds",
                                                    emoji: "<:add:1260157236043583519>",
                                                    description: `Send all Message Types and options!`
                                                },
                                                {
                                                    value: "no_bots",
                                                    label: "Not Send Bot Messages",
                                                    emoji: "<:add:1260157236043583519>",
                                                    description: `Send all Message Types and options!`
                                                },
                                                {
                                                    value: "no_webhooks",
                                                    label: "Not Send Webhook Messages",
                                                    emoji: "<:add:1260157236043583519>",
                                                    description: `Send all Message Types and options!`
                                                },
                                                {
                                                    value: "no_components",
                                                    label: "Not Send Components",
                                                    emoji: "<:add:1260157236043583519>",
                                                    description: `Send all Message Types and options!`
                                                },
                                                {
                                                    value: "add_reactions",
                                                    label: "Add Status Reactions",
                                                    emoji: "<:add:1260157236043583519>",
                                                    description: `Send all Message Types and options!`
                                                }
                                            ]
                                        )
                                )
                            )
                            .addActionRowComponents(
                                new ActionRowBuilder<ButtonBuilder>().addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("channel-link-delete:" + data.UUID)
                                        .setLabel("Delete Channel Link")
                                        .setEmoji("<:trash:1259432932234367069>")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                            )
                    ]
                })

            }
        } catch (e) {
            console.log(e)
        }
    }
}

