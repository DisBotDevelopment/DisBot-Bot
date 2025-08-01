import {ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "leave.toggle",
    options: {
        once: false,
        permission: PermissionType.LeaveWelcome,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.SendMessages],
        userPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
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
                            LeaveEnabled: true,
                        }
                    });
                }

                await database.guildFeatureToggles.update(
                    {
                        where: {
                            GuildId: interaction.guild.id
                        },
                        data: {
                            LeaveEnabled: true
                        }
                    },
                );

                await interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "toggleon",
                        client.user.id
                    )} Leave System is now enabled`,
                    flags: MessageFlags.Ephemeral
                });
            }
                break;
            case "off": {
                if (!data) {
                    await database.guildFeatureToggles.create({
                        data: {
                            GuildId: interaction.guild.id,
                            LeaveEnabled: false
                        }
                    });
                }

                await database.guildFeatureToggles.update(
                    {
                        where: {
                            GuildId: interaction.guild.id
                        },
                        data: {
                            LeaveEnabled: false
                        }
                    }
                );

                await interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "toggleoff",
                        client.user.id
                    )} Leave System is now disabled`,
                    flags: MessageFlags.Ephemeral
                });
            }
                break;
        }
    }
};
