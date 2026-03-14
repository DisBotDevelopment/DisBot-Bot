import {
    ActionRowBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    MessageFlags,
    ModalBuilder, Partials,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../../types/ExtendedClient.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";
import {convertToEmojiToPng} from "../../../../helper/emojis.js";
import {randomUUID} from "crypto";
import {MessageBuilder} from "../../../../helper/messageHelper.js";
import {generateLevelCardImage} from "../../../../systems/level/levelImages.js";
import {sendDefaultMessage} from "../../../../helper/utilityHelper.js";

export default {
    subCommand: "level.stats",
    options: {
        once: false,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {

        await interaction.deferReply()
        try {
            const user = await interaction.guild.members.fetch(interaction.options.getUser("user")?.id ?? interaction.user.id);

            let data = await database.levels.findFirst({
                include: {
                    LevelSettings: true
                },
                where: {
                    UserId: user.id,
                    GuildId: interaction.guild.id
                }
            })

            if (!data) {
                await database.levels.create({
                    data: {
                        Level: 0,
                        RequiredXp: "0",
                        XP: "0",
                        CurrentStreakDay: 0,
                        ClaimedXPDrops: [],
                        Users: {
                            connect: {
                                UserId: interaction.user.id
                            }
                        },
                        LevelSettings: {
                            connect: {
                                GuildId: interaction.guild.id
                            }
                        },
                        UUID: randomUUID()
                    }
                })

                data = await database.levels.findFirst({
                    include: {
                        LevelSettings: true
                    },
                    where: {
                        UserId: user.id,
                        GuildId: interaction.guild.id
                    }
                })

                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No User Data found...`, interaction, true, "reply")
            }

            const message = await database.messageTemplates.findFirst({
                where: {
                    Name: data.LevelSettings?.LevelUserInfoMessageTemplate ?? ""
                }
            })

            if (!message) {
                return
            }

            const rankImage = await generateLevelCardImage(user, interaction.guildId)
            const placeholder = {
                user: {
                    id: interaction.user.id,
                    name: interaction.user.username,
                    displayName: interaction.user.displayName,
                    avatar: interaction.user.displayAvatarURL()
                },
                level: {
                    rankCard: rankImage,
                    xp: Math.round(parseInt(data.XP)),
                    requiredXp: Math.round(parseInt(data.RequiredXp)),
                    level: data.Level,
                    streakDay: data.CurrentStreakDay
                }
            }


            const builder = await MessageBuilder(
                message, placeholder
            )

            await interaction.editReply(builder.messageData)
        } catch (e) {
            console.log(e)
        }
    },
};