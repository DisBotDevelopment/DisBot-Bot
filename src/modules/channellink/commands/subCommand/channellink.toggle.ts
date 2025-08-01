import {ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "channellink.toggle",
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
        if (!client.user) throw new Error("Client user not found");
        if (!interaction.guild) throw new Error("Guild not found");
        if (!interaction.member) throw new Error("Member not found");

        const getState = interaction.options.getString("toggle");
        const data = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        });

        switch (getState) {
            case "on": {
                if (!data) {
                    await database.guildFeatureToggles.create({
                        data: {
                            GuildId: interaction.guild.id,
                            ConnectionsEnabled: true
                        }
                    });
                }

                await database.guildFeatureToggles.update(
                    {
                        where: {
                            GuildId: interaction.guild.id
                        },
                        data: {
                            ConnectionsEnabled: true
                        }
                    }
                );

                await interaction.editReply({
                    content: `## ${await convertToEmojiPng(
                        "toggleon",
                        client.user.id
                    )} Connections is now enabled`
                });
            }
                break;
            case "off": {
                if (!data) {
                    await database.guildFeatureToggles.create({
                        data: {
                            GuildId: interaction.guild.id,
                            ConnectionsEnabled: false
                        }
                    });
                }

                await database.guildFeatureToggles.update(
                    {
                        where: {
                            GuildId: interaction.guild.id
                        },
                        data: {
                            ConnectionsEnabled: false
                        }
                    }
                );

                await interaction.editReply({
                    content: `## ${await convertToEmojiPng(
                        "toggleoff",
                        client.user.id
                    )} Connections is now disabled`
                });
            }
                break;
        }
    }
};
