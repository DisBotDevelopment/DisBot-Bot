import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
// @ts-ignore
import {get, url} from "sourcebin";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
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

        const inputurl = interaction.options.getString("url");

        const data = url(inputurl as string).key;
        const bin = await get({key: data});

        const file = bin.files[0].content?.split(",");
        const sting = file?.toString();
        const words = sting?.split(",");

        for (const w of words) {
            const dbdata = await database.chatModerations.findFirst({
                where: {
                    GuildId: interaction.guild?.id
                }
            });

            if (!client.user) throw new Error("Client user not found");

            if (!dbdata)
                await interaction.editReply({
                    content: `## ${await convertToEmojiPng(
                        "info",
                        client.user?.id
                    )} Please use the \`/chafilter settings\` first`
                });

            await database.chatModerations.update({
                where: {
                    GuildId: interaction.guild.id
                },
                data: {
                    Words: {
                        push: w
                    }
                }
            })

            await interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "check",
                    client.user.id
                )} The words have been imported.`
            });
        }
    },
    options: {
        once: false,
        permission: PermissionType.ChatFilter,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
        userPermissions: [PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    subCommand: "chatfilter.import"
};
