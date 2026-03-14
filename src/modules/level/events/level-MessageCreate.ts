import {
    Events,
    type GuildTextBasedChannel,
    Message,
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {calcXP, levelUpHelper, manageXPStreakDays} from "../../../systems/level/levelMath.js";
import ms, {type StringValue} from "ms";


export default {
    name: Events.MessageCreate,

    /**
     *
     * @param {Message} message
     * @param {ExtendedClient} client
     */
    async execute(message: Message, client: ExtendedClient) {

        const data = await database.levelSettings.findFirst({
            include: {
                Levels: true,
                LevelRoles: true,
                XPDrops: true,
                XPStreaks: true,
            },
            where: {
                GuildId: message.guildId ?? ""
            }
        })

        if (!data) return
        if (!data.IsLevelModuleEnabled) return
        if (!data.IsMessageXPEnabled) return
        if (message.author.bot) return;
        if (message.webhookId) return

        let userData = await database.levels.findFirst({
            where: {
                UserId: message.author.id,
                GuildId: message.guildId ?? ""
            }
        })

        if (!userData) {
            await database.levels.create({
                data: {
                    Users: {
                        connectOrCreate: {
                            create: {
                                Username: message.author.username,
                                UserId: message.author.id,
                            },
                            where: {
                                UserId: message.author.id,
                            }
                        }
                    },
                    LevelSettings: {
                        connect: {
                            GuildId: message.guildId ?? ""
                        }
                    },
                    XP: "0",
                    ClaimedXPDrops: [],
                    CurrentStreakDay: 0,
                    RequiredXp: `${data.RequiredXPForFirstLevel}`,
                    Level: 0,
                    UUID: randomUUID(),
                }
            })
            userData = await database.levels.findFirst({
                where: {
                    UserId: message.author.id,
                    GuildId: message.guildId ?? ""
                }
            })
        }

        if (data.ExcludeUserIds.length > 0) {
            for (const userId of data.ExcludeUserIds) {
                if (message.author.id == userId) return
            }
        }
        if (data.ExcludeRoleIds.length > 0) {
            for (const roleId of data.ExcludeRoleIds) {
                if (message.member?.roles.cache.has(roleId)) return
            }
        }
        if (data.ExcludedChannelIds.length > 0) {
            for (const channelId of data.ExcludedChannelIds) {
                if (message.channelId == channelId) return
            }
        }

        function messageXP() {
            const messageXPRange = data?.MessageXPRange ?? "0-100"
            let xpCalculation = calcXP(parseInt(messageXPRange.split("-")[0] ?? "0"), parseInt(messageXPRange.split("-")[1] ?? "100"))
            if (userData?.CurrentStreakDay != 0) {
                if (data!.XPStreaks.length > 0 && data?.XPStreaks[userData?.CurrentStreakDay]) {
                    const streak = data?.XPStreaks[userData?.CurrentStreakDay]
                    if (!streak) return xpCalculation
                    xpCalculation *= streak.Multiplier
                }
            }
            return xpCalculation
        }

        const messageXPType = data.MessageXPType // message, cooldown
        if (!messageXPType) return
        // When more maybe switch?
        if (messageXPType.includes("message")) {
            const messageXPData = messageXP()
            await database.levels.update({
                where: {
                    UUID: userData?.UUID ?? ""
                },
                data: {
                    XP: `${(parseInt(userData?.XP ?? "0") + messageXPData)}`,
                }
            })
            userData = await database.levels.findFirst({
                where: {
                    UserId: message.author.id,
                    GuildId: message.guildId ?? ""
                }
            })
        } else if (messageXPType.includes("cooldown")) {
            if (!data.MessageXPCooldown) return
            const messageXPCooldown = ms(data.MessageXPCooldown as StringValue)
            if (client.cooldowns?.has(`${message.author.id}-message`)) return
            // Cooldown

            const messageXPData = messageXP()
            await database.levels.update({
                where: {
                    UUID: userData?.UUID ?? ""
                },
                data: {
                    XP: `${(parseInt(userData?.XP ?? "0") + messageXPData)}`,
                }
            })
            userData = await database.levels.findFirst({
                where: {
                    UserId: message.author.id,
                    GuildId: message.guild?.id ?? ""
                }
            })

            // Cooldown
            setTimeout(() => {
                client.cooldowns?.delete(`${message.author.id}-message`)
            }, messageXPCooldown)
            client.cooldowns?.set(`${message.author.id}-message`, messageXPCooldown)
        }

        await levelUpHelper(
            message.member!,
            message.guild!,
            message.channel as GuildTextBasedChannel,
        )
        await manageXPStreakDays(
            message.guild!,
            message.member!,
            message.channel as GuildTextBasedChannel,
            "message"
        )
    }
}

