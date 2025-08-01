import {ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "welcome.toggle",
    options: {
        once: false,
        permission: PermissionType.LeaveWelcome,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
        userPermissions: [PermissionFlagsBits.ManageMessages],
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
                            GuildId: interaction.guild?.id,
                            WecomeEnabled: true
                        }
                    });
                }

                await database.guildFeatureToggles.update(
                    {
                        where: {GuildId: interaction.guild?.id},
                        data: {WecomeEnabled: true}
                    }
                );
                if (!client.user) throw new Error("Client user not found");
                interaction.editReply({
                    content: `## ${await convertToEmojiPng(
                        "toggleon",
                        client.user.id
                    )} Welcome is now enabled`
                });
            }
                break;
            case "off": {
                if (!data) {
                    await database.guildFeatureToggles.create({
                        data: {
                            GuildId: interaction.guild?.id,
                            WecomeEnabled: false
                        }
                    });
                }

                await database.guildFeatureToggles.update(
                    {
                        where: {GuildId: interaction.guild?.id},
                        data: {WecomeEnabled: false}
                    }
                );
                if (!client.user) throw new Error("Client user not found");
                interaction.editReply({
                    content: `## ${await convertToEmojiPng(
                        "toggleoff",
                        client.user.id
                    )} Welcome is now disabled`
                });
            }

                break;
        }
    }
};
