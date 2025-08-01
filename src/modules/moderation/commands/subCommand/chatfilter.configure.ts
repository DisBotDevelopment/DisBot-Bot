import {ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "chatfilter.configure",
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

        const {options, guildId} = interaction;
        const getOptions = options.getString("options");
        const getWords = options.getString("word")?.toLowerCase().split(",");

        const query = {
            GuildID: guildId
        };

        switch (getOptions) {
            case "add": {
                const chatFilterData = await database.chatModerations.findFirst({
                    where: {
                        GuildId: interaction.guild.id
                    }
                })

                if (!client.user) throw new Error("Client user not found");
                if (!chatFilterData)
                    return interaction.editReply({
                        content: `## ${await convertToEmojiPng(
                            "info",
                            client.user?.id
                        )} The Setup is not Ready. Use: \`\`\`/chatfilter setting\`\`\``
                    });

                const newWords = [];

                for (const w of getWords) {
                    if (chatFilterData.Words.includes(w)) continue;
                    newWords.push(w);
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
                }

                return interaction.editReply({
                    content: `## ${await convertToEmojiPng(
                        "check",
                        client.user.id
                    )} You have added \`\`${newWords.length
                    }\`\` word(s) to the Chat Blacklist`
                });
            }
            case "remove": {

                const chatFilterData = await database.chatModerations.findFirst({
                    where: {
                        GuildId: interaction.guild.id
                    }
                });


                if (!client.user) throw new Error("Client user not found");
                if (!chatFilterData)
                    return interaction.editReply({
                        content: `## ${await convertToEmojiPng(
                            "error",
                            client.user?.id
                        )} No words to remove.`
                    });

                const removedWords: any[] = [];

                for (const w of getWords) {
                    if (!chatFilterData.Words.includes(w)) continue;


                    const newWorlds = [...chatFilterData.Words]
                    newWorlds.splice(
                        newWorlds.indexOf(w),
                        1
                    );
                    removedWords.push(w);
                    await database.chatModerations.update({
                        where: {
                            GuildId: interaction.guild.id
                        }, data: {
                            Words: {
                                set: newWorlds
                            }
                        }
                    })
                }

                return interaction.editReply({
                    content: `## ${await convertToEmojiPng(
                        "check",
                        client.user.id
                    )} You have removed \`\`${removedWords.length
                    }\`\` word(s) from the Chat Blacklist`
                });
            }
        }

        subCommand: "chatfilter.configure"
    }
}
