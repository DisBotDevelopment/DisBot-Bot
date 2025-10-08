import {ButtonStyle, ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "tempvoice.remove", options: {
        once: false,
        permission: PermissionType.TempVoice,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
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
        if (!client.user) throw new Error("Client user not found");
        if (!interaction.guild) throw new Error("Guild not found");
        if (!interaction.member) throw new Error("Member not found");

        const channel = interaction.options.getChannel("channel")?.id;

        const data = await database.tempVoices
            .findFirst({
                include: {
                    TempVoiceChannels: true
                },
                where: {
                    JointoCreateChannel: channel
                }
            })

        for (const channels of data.TempVoiceChannels) {
            const tempVoiceChannel = await interaction.guild.channels.fetch(channels.ChannelId)
            await tempVoiceChannel.delete()
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user?.id)} Deleted old TempVC Channel <#${channels.ChannelId}>!`
            });
        }

        await database.tempVoiceChannels
            .deleteMany({
                where: {
                    TempVoiceId: data.UUID
                }
            }).then(async (result) => {
                await database.tempVoices
                    .deleteMany({
                        where: {
                            JointoCreateChannel: channel
                        }
                    })

                if (!client.user) throw new Error("Client user not found");
                await interaction.editReply({
                    content: `## ${await convertToEmojiPng("check", client.user?.id)} You have removed the Tempvoice Channel`
                });
            })
    }
};
