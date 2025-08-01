import {ButtonStyle, ChannelType, ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";

export default {
    subCommand: "discord.message",
    options: {
        once: false,
        permission: PermissionType.Discord,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.SendMessages],
        userPermissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.SendMessages],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        })

        const channel = interaction.channel;
        const message = interaction.options.getString("message");

        if (!client.user) throw new Error("No user was found.");

        if (!channel) {
            return interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} Please run this in as a text channel`,
            });
        }

        if (channel.type !== ChannelType.GuildText) {
            return interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} Please run this in as a text channel`,
            });
        }

        if (message?.length === 0) {
            return interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} Please provide a message`,
            });
        }

        await channel.send({
            content: `${message}\n-# ${interaction.user.username} (${interaction.user.id}) \n-# ${interaction.guild?.name} (${interaction.guild?.id}) \n-# **This Message is not from the DisBot Team**`,
        });

        return interaction.editReply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} Message sent to ${channel.name}`,
        });
    }
};
