import {ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "logging.toggle", options: {
        once: false,
        permission: PermissionType.Logging,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
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

        const {options, guildId, guild} = interaction;

        const getToggle = options.getString("toggle");
        const data = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: interaction.guild?.id
            }
        });

        switch (getToggle) {
            case "on": {
                if (!data) {
                    await database.guildFeatureToggles.create({
                        data: {
                            GuildId: guildId,
                            LoggingEnabled: true
                        }
                    });
                }

                await database.guildFeatureToggles.update({
                        where: {
                            GuildId: guildId
                        },
                        data: {
                            LoggingEnabled: true
                        }
                    }
                );

                if (!client.user) throw new Error("Client is not ready yet");

                return await interaction.editReply({
                    content: `## ${await convertToEmojiPng(
                        "toggleon",
                        client.user.id
                    )} Logging is now enabled`
                });
            }
            case "off": {
                if (!data) {
                    await database.guildFeatureToggles.create({
                        data: {
                            GuildId: guildId,
                            LoggingEnabled: false
                        }
                    });
                }

                await database.guildFeatureToggles.update({
                        where: {
                            GuildId: guildId
                        },
                        data: {
                            LoggingEnabled: false
                        }

                    }
                )

                if (!client.user) throw new Error("Client is not ready yet");

                return await interaction.editReply({
                    content: `## ${await convertToEmojiPng(
                        "toggleoff",
                        client.user.id
                    )} Logging is now disabled`
                });
            }
        }
    }
};
