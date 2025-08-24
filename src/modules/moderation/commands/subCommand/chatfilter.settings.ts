import {ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";
import {query} from "winston";

export default {
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

        const {options, guildId, guild} = interaction;
        const getChannel = options.getChannel("channel")?.id || null;

        const chatFilterData = await database.guildChatModeration.findFirst({
            where: {
                GuildId: guildId
            }
        });

        if (!chatFilterData)
            await database.guildChatModeration.create({
                data: {
                    GuildId: guildId,
                    LogChannelId: getChannel,
                    WhiteListChannelIds: [],
                    WhiteListRoleIds: []
                }
            });
        else if (chatFilterData.LogChannelId != null) {
            await database.guildChatModeration.update(
                {
                    where: {
                        GuildId: guildId,
                    },
                    data: {
                        LogChannelId: null
                    }
                });

            return interaction.editReply({
                content: `You have removed the Log Channel`
            });
        }
        await database.guildChatModeration.update(
            {
                where: {
                    GuildId: guildId,
                },
                data: {
                    LogChannelId: getChannel
                }
            });

        return interaction.editReply({
            content: `You have set the Log Channel to ${getChannel}`
        });
    },

    subCommand: "chatfilter.settings"
};
