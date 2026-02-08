import {
    ActionRowBuilder, ButtonBuilder,
    ButtonStyle, ChannelSelectMenuBuilder,
    ChatInputCommandInteraction, ContainerBuilder,
    MessageFlags,
    ModalBuilder, Partials,
    PermissionFlagsBits, RoleSelectMenuBuilder, StringSelectMenuBuilder,
    TextInputBuilder,
    TextInputStyle, UserSelectMenuBuilder
} from "discord.js";
import {ExtendedClient} from "../../../../types/ExtendedClient.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";
import {convertToEmojiToPng} from "../../../../helper/emojis.js";
import {randomUUID} from "crypto";
import {MessageBuilder} from "../../../../helper/messageHelper.js";
import {generateLevelCardImage, generateLevelLeaderboard} from "../../../../systems/level/levelImages.js";
import {NUM} from "undici/lib/llhttp/constants.js";

export default {
    subCommand: "level.leaderboard",
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

        await interaction.deferReply();
        try {
            const currentIndex = 0;

            let data = await database.levelSettings.findFirst({
                include: {
                    Levels: true
                },
                where: {
                    GuildId: interaction.guild.id
                }
            })

            let message = await database.messageTemplates.findFirst({
                where: {
                    Name: data.LeaderboardMessageTemplateId
                }
            })

            if (!message) {
                return
            }

            const list = data.Levels.sort((a, b) => {
                return (b.Level - a.Level)
            }).slice(currentIndex, currentIndex + (data.LeaderboardDisplayAmount == null || data.LeaderboardDisplayAmount == 0 ? 10 : data.LeaderboardDisplayAmount));

            const leaderboardImageDefault = await generateLevelLeaderboard(interaction.guild, "default", list)
            const leaderboardImageHorizontal = await generateLevelLeaderboard(interaction.guild, "horizontal", list)
            const placeholder = {
                user: {
                    id: interaction.user.id,
                    name: interaction.user.username,
                    displayName: interaction.user.displayName,
                    avatar: interaction.user.displayAvatarURL() ?? "https://cdn.discordapp.com/embed/avatars/0.png"
                },
                level: {
                    leaderboard: {
                        leaderboardImageDefault: leaderboardImageDefault,
                        leaderboardImageHorizontal: leaderboardImageHorizontal,
                        message: data?.Levels.length < 0 ? list.map((l, index) => {
                            const user = interaction.guild.members.cache.get(l.UserId);
                            const rank = index + 1;
                            const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `**${rank}.**`;
                            return `${rankIcon} **${user?.user?.username || 'Unknown'}** ┃ Level ${l.Level} ┃ ${l.XP}/${l.RequiredXp} XP`;
                        }).join('\n') : "N/A",
                        proccessBarMessage: data?.Levels.length < 0 ? list.map((l, index) => {
                            const user = interaction.guild.members.cache.get(l.UserId);
                            const rank = index + 1;
                            const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `**${rank}.**`;
                            return `${rankIcon} **${user?.user?.username || 'Unknown'}** ┃ Level ${l.Level} ┃ ${l.XP}/${l.RequiredXp} XP`;
                        }).join('\n') : "N/A",
                        topMessage: data?.Levels.length < 0 ? list.map((l, index) => {
                            const user = interaction.guild.members.cache.get(l.UserId);
                            return `\`${(index + 1).toString().padStart(2, ' ')}\` ${user?.user?.username.padEnd(20, ' ')} » LVL ${l.Level.toString().padStart(3, ' ')} » ${l.XP} XP`;
                        }).join('\n') : "N/A",
                        gamifiedMessage: data?.Levels.length < 0 ? list.map((l, index) => {
                            const user = interaction.guild.members.cache.get(l.UserId);
                            const titles = ['👑 LEGEND', '💎 ELITE', '🔥 PRO', '⭐ VETERAN', '🚀 RISING'];
                            return `**${titles[index]}**\n${user?.user?.username} - Level ${l.Level} (${l.XP} XP)\n*Next: ${Number(l.RequiredXp) - Number(l.XP)} XP needed*`;
                        }).join('\n\n') : "N/A"
                    },
                    levelMembers: data?.Levels?.length ?? "N/A",
                }
            }

            const builder = await MessageBuilder(
                message, placeholder
            )

            const uuid = data.Levels[0].UserId

            const navigationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:arrowbackregular24:1301119279088799815>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`level-leaderboard-pagination:${uuid}:${currentIndex - data.LeaderboardDisplayAmount}:${Math.random() * 10}`)
                    .setDisabled(currentIndex === 0),
                new ButtonBuilder()
                    .setEmoji("<:next:1287457822526935090>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`level-leaderboard-pagination:${uuid}:${currentIndex + data.LeaderboardDisplayAmount}:${Math.random() * 10}`)
                    .setDisabled(currentIndex + data.LeaderboardDisplayAmount >= data.Levels.length)
            );

            let components = []
            if ((builder.messageData as any).components && (builder.messageData as any).components?.length > 0) {
                (builder.messageData as any).components.forEach((component: any) => {
                    components.push(component);
                })
                components.push(navigationRow)
            } else {
                components.push(navigationRow)
            }

            await interaction.editReply({
                ...builder.messageData,
                components: components
            });

        } catch (e) {
            console.log(e)
        }
    }
}