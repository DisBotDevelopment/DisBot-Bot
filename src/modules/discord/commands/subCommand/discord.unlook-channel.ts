import { ChannelType, ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, RoleResolvable, TextChannel } from "discord.js";
import { ExtendedClient } from "../../../../types/client.js";
import { convertToEmojiPng } from "../../../../helper/emojis.js";
import { PermissionType } from "../../../../enums/permissionType.js";

export default {
    subCommand: "discord.unlook-channel",
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
        const channel = interaction.channel as TextChannel | null;
        const role = interaction.options.getRole("role");
        const permission = interaction.options.getString("permission");

        if (!client.user) throw new Error("No user was found.");


        if (!channel) {
            return await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} Please use this command in a text channel`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (channel.type !== ChannelType.GuildText) {
            return await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} Please use this command in a text channel`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (permission && permission.length > 0) {

            const permissionObject: any = {}

            for (const perm of permission.split(",")) {
                const [key, value] = perm.split(":");
                if (key && value) {
                    permissionObject[key] = value === "true" ? true : value === "false" ? false : null;
                }
            }

            await channel.permissionOverwrites.edit(role as RoleResolvable, {
                ...permissionObject,
            }, {
                reason: `User ${interaction.user.username} (${interaction.user.id}) used the command /discord.look`
            })

        } else {
            await channel.permissionOverwrites.edit(role as RoleResolvable,
                {
                    SendMessages: null,
                    CreatePublicThreads: null,
                    CreatePrivateThreads: null,
                    AddReactions: null,
                    Speak: null,
                    SendMessagesInThreads: null,
                    Connect: null,
                    UseApplicationCommands: null,
                    UseExternalApps: null
                },
                {
                    reason: `User ${interaction.user.username} (${interaction.user.id}) used the command /discord.look`
                }
            )
        }

        await interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} Removed the lock from the channel ${channel} for the role ${role}`,
            flags: MessageFlags.Ephemeral
        });
    }
};
