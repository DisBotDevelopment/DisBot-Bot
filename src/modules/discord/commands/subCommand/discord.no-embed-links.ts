import {ChannelType, ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, TextChannel} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "discord.no-embed-links",
    options: {
        once: false,
        permission: PermissionType.Discord,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages],
        userPermissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {
        if (!client.user) throw new Error("User is not logged in.");

        const channel = interaction.options.getChannel("channel", true) as TextChannel

        await interaction.deferReply(
            {
                flags: MessageFlags.Ephemeral
            }
        )

        const data = await database.discordAddons.findFirst({
            where: {
                GuildId: interaction.guild?.id
            }
        })
        if (!data) {
            await database.discordAddons.create({
                data: {
                    GuildId: interaction.guild?.id,
                    InvitesPaused: false,
                    OnlyMedia: [],
                    NoLinkEmbeds: []
                }
            })
        }

        if (data?.NoLinkEmbeds.includes(channel.id)) {
            await database.discordAddons.update({
                where: {
                    GuildId: interaction.guild.id
                }
                , data: {
                    NoLinkEmbeds: {
                        set: data.NoLinkEmbeds.filter((r) => r != channel.id)
                    }
                }
            })
            return interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} This channel is already disabled for No-Link-Embeds and will be removed from the list!`
            })
        } else {
            await database.discordAddons.update({
                where: {
                    GuildId: interaction.guild.id
                },
                data: {
                    NoLinkEmbeds: {
                        push: channel.id
                    }
                }
            })
            return interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} This channel is now enabled for NoLinkEmbeds!`
            })
        }
    }
};
