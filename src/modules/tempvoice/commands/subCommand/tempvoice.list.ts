import {ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, TextChannel} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "tempvoice.list",
    options: {
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

        const data = await database.tempVoices.findMany({
            where: {
                GuildId: interaction.guild.id
            }
        });

        if (data.length <= 0)
            return interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} No TempVoice Channels found in this server`
            });


        const list = data.map((twitchDocument) => {
            return `> **Voice Channel**: <#${twitchDocument.JointoCreateChannel}>\n> **Category**: <#${twitchDocument.JointoCreateCategory}>\n\n`
        });

        await interaction.editReply({
            content: `## ${await convertToEmojiPng(
                "check",
                client.user.id
            )} Current setups from this server.\n${list}`
        });
    }
};
