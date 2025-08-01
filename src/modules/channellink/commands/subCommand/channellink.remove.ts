import {ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "channellink.remove",
    options: {
        once: false,
        permission: PermissionType.ChatFilter,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
        userPermissions: [PermissionFlagsBits.ManageGuild],
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
        });

        if (!interaction.guild) throw new Error("Guild not found");
        if (!interaction.member) throw new Error("Member not found");

        const channel = interaction.options.getChannel("channel");


        const data = await database.channelLinks.findFirst({

            where: {
                ChannelId: channel?.id,
                GuildId: interaction.guild?.id
            }

        });

        if (!data) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(
                            `The Channel ${channel} is not connected with any Channel`
                        )
                        .setColor("#2B2D31")
                ]
            });
        }

        await database.channelLinks.delete({
            where: {
                id: data.id,
                ChannelId: channel?.id,
                GuildId: interaction.guild?.id
            }
        });

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Channel Removed")
                    .setDescription(`The Channel ${channel} is now disconnected`)
                    .setColor("#00FF00")
            ]
        });
    }
};
