import {ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

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

        const {guildId} = interaction;

        const getChannel = interaction.options.getChannel("channel");
        const getRole = interaction.options.getRole("role");
        const getOptions = interaction.options.getString("options");

        switch (getOptions) {
            case "add": {

                const chatFilterData = await database.guildChatModeration.findFirst({
                    where: {
                        GuildId: guildId
                    }
                });


                if (!client.user) throw new Error("Client user not found");
                if (!chatFilterData)
                    return interaction.editReply({
                        content: `## ${await convertToEmojiPng(
                            "info",
                            client.user.id
                        )} Plase setup the chatfilter first. Use: \`\`\`/chatfilter settings\`\`\``
                    });

                if (getRole && getChannel) {
                    await database.guildChatModeration.update(
                        {
                            where: {
                                GuildId: interaction.guildId
                            }, data: {
                                WhiteListRoleIds: {
                                    push: getRole.id
                                }
                            }
                        }
                    )

                    await database.guildChatModeration.update(
                        {
                            where: {
                                GuildId: interaction.guildId
                            }, data: {
                                WhiteListChannelIds: {
                                    push: getChannel.id
                                }
                            }
                        }
                    )

                    return interaction.editReply({
                        content: `## ${await convertToEmojiPng(
                            "check",
                            client.user.id
                        )} You have add ${getRole} as Whtielist Role. And ${getChannel} as Whtielist Channel.`
                    });
                }

                if (getRole) {
                    await database.guildChatModeration.update(
                        {
                            where: {
                                GuildId: interaction.guildId
                            }, data: {
                                WhiteListRoleIds: {
                                    push: getRole.id
                                }
                            }
                        }
                    )
                    await interaction.editReply({
                        content: `## ${await convertToEmojiPng(
                            "check",
                            client.user.id
                        )} I have added ${getRole} as Whtielist Role.`
                    });
                } else if (getChannel) {

                    await database.guildChatModeration.update(
                        {
                            where: {
                                GuildId: interaction.guildId
                            }, data: {
                                WhiteListChannelIds: {
                                    push: getChannel.id
                                }
                            }
                        }
                    )
                    return interaction.editReply({
                        content: `## ${await convertToEmojiPng(
                            "check",
                            client.user.id
                        )} I have added ${getChannel} as Whtielist Channel.`
                    });
                } else {
                    await interaction.editReply({
                        content: `## ${await convertToEmojiPng(
                            "error",
                            client.user.id
                        )} You did not specify anything. Please specify a channel or a role.`
                    });
                }
            }
                break;

            case "remove": {
                const chatFilterData = await database.guildChatModeration.findFirst({
                    where: {
                        GuildId: guildId
                    }
                });

                if (!client.user) throw new Error("Client user not found");
                if (!chatFilterData)
                    return interaction.editReply({
                        content: `## ${await convertToEmojiPng(
                            "info",
                            client.user.id
                        )} Please setup the chatfilter first. Use: \`\`\`/chatfilter settings\`\`\``
                    });

                const roleId = getRole?.id;
                const channelId = getChannel?.id;

                if (roleId) {
                    const newRoles = chatFilterData.WhiteListRoleIds.filter((r: string) => r !== roleId);
                    await database.guildChatModeration.update({
                        where: {
                            GuildId: interaction.guildId
                        },
                        data: {
                            WhiteListRoleIds: {
                                set: newRoles
                            }
                        }
                    });
                }

                if (channelId) {
                    const newChannels = chatFilterData.WhiteListChannelIds.filter((c: string) => c !== channelId);
                    await database.guildChatModeration.update({
                        where: {
                            GuildId: interaction.guildId
                        },
                        data: {
                            WhiteListChannelIds: {
                                set: newChannels
                            }
                        }
                    });
                }

                if (roleId && channelId) {
                    return interaction.editReply({
                        content: `## ${await convertToEmojiPng("check", client.user.id)} I have removed ${getRole} as Whitelist Role and ${getChannel} as Whitelist Channel.`
                    });
                } else if (roleId) {
                    return interaction.editReply({
                        content: `## ${await convertToEmojiPng("check", client.user.id)} I have removed ${getRole} as Whitelist Role.`
                    });
                } else if (channelId) {
                    return interaction.editReply({
                        content: `## ${await convertToEmojiPng("check", client.user.id)} I have removed ${getChannel} as Whitelist Channel.`
                    });
                } else {
                    return interaction.editReply({
                        content: `## ${await convertToEmojiPng("error", client.user.id)} You did not specify anything. Please specify a channel or a role.`
                    });
                }
            }
            case "list": {


                const chatFilterData = await database.guildChatModeration.findFirst({
                    where: {
                        GuildId: guildId
                    }
                });

                if (!client.user) throw new Error("Client user not found");
                if (!chatFilterData)
                    return interaction.editReply({
                        content: `## ${await convertToEmojiPng(
                            "info",
                            client.user.id
                        )} Plase setup the chatfilter first. Use: \`\`\`/chatfilter settings\`\`\``
                    });
                interaction.editReply({
                    content: `Channel: ${chatFilterData.WhiteListChannelIds.map(
                        (c: any) => ` <#${c}> `
                    )}\nRole: <@&${chatFilterData.WhiteListRoleIds}>`
                });
                break;
            }
        }
    },

    subCommand: "chatfilter.whitelist"
};
