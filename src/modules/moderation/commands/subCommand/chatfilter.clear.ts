import {ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "chatfilter.clear",
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

        const query = {
            GuildID: guildId
        };

        const chatFilterData = await database.chatModerations.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        });
        if (!chatFilterData) {
            if (!client.user) throw new Error("Client user not found");
            return interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "info",
                    client.user?.id
                )} There is no Chat Blacklist to clear. Use: \`\`\`/chatfilter settings\`\`\``
            });
        }
        if (chatFilterData.Words.length < 1) {
            if (!client.user) throw new Error("Client user not found");
            return interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "info",
                    client.user.id
                )} Chat Blacklist is already empty!`
            });
        }

        await database.chatModerations.delete({
            where: {
                GuildId: guildId
            }
        });
        if (!client.user) throw new Error("Client user not found");
        return interaction.editReply({
            content: `## ${await convertToEmojiPng(
                "check",
                client.user.id
            )} Chat Blacklist was deleted!`
        });
    },
};
