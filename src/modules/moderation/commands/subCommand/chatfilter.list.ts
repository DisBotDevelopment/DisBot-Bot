import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
// @ts-ignore
import * as sourcebin from "sourcebin";
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

        const {guildId} = interaction;

        const chatFilterData = await database.chatModerations.findFirst({
            where: {
                GuildId: guildId
            }
        })

        if (!client.user) throw new Error("Client user not found");

        if (!chatFilterData)
            return interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "info",
                    client.user.id
                )} The Setup is not Ready. Use: \`\`\`/chatfilter setting\`\`\``
            });

        if (chatFilterData.Words.length < 1)
            return interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} No Words on the List`
            });

        await sourcebin
            .create({
                title: `Chat Blacklist`,
                description: `Chat Blacklist`,
                files: [
                    {
                        name: `Chat Blacklist`,
                        content: `${chatFilterData.Words.map((w: any) => w).join(",") || "no words"
                        }`,
                        language: "text"
                    }
                ]
            })
            .then((binData: any) => {
                return interaction.editReply({
                    content: `${binData.url}`
                });
            });
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
    subCommand: "chatfilter.list"
};
