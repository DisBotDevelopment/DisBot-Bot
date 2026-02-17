import {database} from "../../main/database.js";
import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle,
    Guild,
    GuildMember,
    GuildTextBasedChannel,
    Message, MessageFlags
} from "discord.js";
import {replacePlaceholders} from "../../main/placeholder.js";
import {MessageBuilder} from "../../helper/messageHelper.js";
import {ExtendedClient} from "../../types/ExtendedClient.js";
import ms, {StringValue} from "ms";
import * as mathjs from "mathjs";

export function calcXP(minXP: number, maxXP: number) {
    return Math.random() * (maxXP - minXP) + minXP
}

export async function levelUpHelper(member: GuildMember, guild: Guild, channel: GuildTextBasedChannel) {

    const data = await database.levelSettings.findFirst({
        include: {
            Levels: true,
            LevelRoles: true,
            XPDrops: true,
            XPStreaks: true,
        },
        where: {
            GuildId: guild.id
        }
    })

    if (!data) return
    if (!data.IsLevelModuleEnabled) return
    let userData = await database.levels.findFirst({
        where: {
            UserId: member.id,
            GuildId: guild.id
        }
    })

    if (parseInt(userData.RequiredXp) > parseInt(userData.XP)) return
    {
    }
    // {level} {xp}
    const xpFormular = {
        level: userData?.Level ?? 0,
        xp: userData?.RequiredXp ?? 0
    }
    const formular = replacePlaceholders(data.RequiredXPFormular, xpFormular)
    const reqXPForLevel = parseInt(mathjs.evaluate(formular))
    if (isNaN(reqXPForLevel)) return
    await database.levels.update({
        where: {
            UUID: userData.UUID,
            UserId: member.id,
            GuildId: guild.id
        },
        data: {
            XP: "0",
            RequiredXp: String(reqXPForLevel),
            Level: (userData?.Level ?? 0) + 1
        }
    })
    userData = await database.levels.findFirst({
        where: {
            UserId: member.id,
            GuildId: guild.id
        }
    })

    // Level Roles...
    for (const roleData of data.LevelRoles) {
        const level = userData.Level
        if (level == roleData.Level) {
            const role = await guild.roles.fetch(roleData.RoleId)
            await member.roles.add(role)
        } else if ((level - 1) == roleData.Level) {
            if (roleData.Types.includes("not")) {

            } else if (roleData.Types.includes("role")) {
                const newLevels = data.LevelRoles.filter((f) => f.Level == level)
                if (newLevels.length > 0) {
                    await member.roles.remove(roleData.RoleId)
                }
            } else if (roleData.Types.includes("level")) {
                await member.roles.remove(roleData.RoleId)
            }

        }
    }

    const levelUpMessageType = data.LevelUpMessageType
    const levelUpPlaceholder = {
        user: {
            username: member.user.username,
            id: member.id,
            displayAvatarURL: member.displayAvatarURL({extension: "png", forceStatic: true}),
            displayName: member.displayName,
            globalName: member.user.globalName
        },
        level: {
            xp: userData?.XP ?? 0,
            level: userData?.Level ?? 0,
            oldLevel: userData?.Level - 1,
            streakDay: userData?.CurrentStreakDay ?? 0,
            requiredXp: userData?.RequiredXp ?? 0,
        }
    }
    if (!data.LevelUpMessageTemplateId) return
    const streakDayTemplate = await database.messageTemplates.findFirst({
        where: {
            Name: data.LevelUpMessageTemplateId
        }
    })

    const messageBuilder = await MessageBuilder(streakDayTemplate, levelUpPlaceholder)
    switch (levelUpMessageType) {
        case "channel": {
            await (channel as GuildTextBasedChannel).send(messageBuilder.messageData)
        }
            break
        case "custom": {
            const channelId = data.LevelUpChannelId
            if (!channelId) return
            const channel = await guild.channels.fetch(channelId) as GuildTextBasedChannel
            await channel.send(messageBuilder.messageData)
        }
            break
        case "user": {
            try {
                await member.createDM(true)
                await member.user.send(messageBuilder.messageData)
            } catch (e) {

            }
        }
            break
    }

    await manageXPStreakDays(
        guild,
        member,
        channel,
        "level"
    )
}

export async function manageXPStreakDays(guild: Guild, member: GuildMember, channel: GuildTextBasedChannel, type: "level" | "voice" | "message") {

    const data = await database.levelSettings.findFirst({
        include: {
            Levels: true,
            LevelRoles: true,
            XPDrops: true,
            XPStreaks: true,
        },
        where: {
            GuildId: guild.id
        }
    })

    if (!data) return
    if (!data.IsLevelModuleEnabled) return
    let userData = await database.levels.findFirst({
        where: {
            UserId: member.id,
            GuildId: guild.id
        }
    })


    // level, message, voice 
    if (!data.XPStreaksIncreaseType.includes(type)) return

    if (data.XPStreaks.length <= 0) return
    if (userData?.LastXPStreakUpdate) {
        const lastStreak = userData.LastXPStreakUpdate
            ? new Date(userData.LastXPStreakUpdate)
            : new Date();
        const today = new Date();
        const sameDay =
            lastStreak.getFullYear() === today.getFullYear() &&
            lastStreak.getMonth() === today.getMonth() &&
            lastStreak.getDate() === today.getDate();
        if (sameDay) return;
    }

    const day = userData.CurrentStreakDay == 0 ? 1 : userData.CurrentStreakDay + 1
    const streakDay = data.XPStreaks.filter((s) => s.Days == day)[0]
    const oldStreakDay = data.XPStreaks.filter((s) => s.Days == (day - 1))[0]

    if (!streakDay) return

    if (oldStreakDay) {
        if (oldStreakDay.RoleRewardIds.length > 0) {
            for (const roleId of oldStreakDay.RoleRewardIds) {
                try {
                    await member.roles.remove(roleId)
                } catch (e) {
                }
            }
        }
    }
    await database.levels.update({
        where: {
            UserId: member.id,
            GuildId: guild.id,
            UUID: userData.UUID
        },
        data: {
            CurrentStreakDay: (userData.CurrentStreakDay ?? 0) + 1,
            LastXPStreakUpdate: new Date().toISOString(),
            Level: userData.Level + (streakDay.BonusLevels ?? 0),
            XP: `${parseInt(userData.XP) + (parseInt(String(streakDay.BonusXP ?? 0)))}`
        }
    })
    userData = await database.levels.findFirst({
        where: {
            UserId: member.id,
            GuildId: guild.id
        }
    })
    if (streakDay.Nickname) {
        const nickPlaceholder = {
            username: member.user.username,
            id: member.id,
            xp: userData.XP,
            level: userData.Level,
            displayName: member.displayName,
            globalName: member.user.globalName,
        }
        const nickname = replacePlaceholders(streakDay.Nickname, nickPlaceholder)
        const fetchedGuildMember = await guild.members.fetch(member.id)
        try {
            await fetchedGuildMember.setNickname(nickname)
        } catch (e) {

        }
    }
    if (streakDay.RoleRewardIds.length > 0) {
        for (const roleId of streakDay.RoleRewardIds) {
            try {
                await member.roles.add(roleId)
            } catch (e) {
            }
        }
    }

    // Streak Message 
    const streakPlaceholder = {
        username: member.user.username,
        xp: userData.XP,
        user: {
            username: member.user.username,
            id: member.id,
            displayAvatarURL: member.displayAvatarURL({extension: "png", forceStatic: true}),
            displayName: member.displayName,
            globalName: member.user.globalName
        },
        level: {
            xp: userData.XP,
            level: userData.Level,
            streakDay: userData.CurrentStreakDay ?? 0,
            oldStreakDay: (userData.CurrentStreakDay ?? 0) - 1,
            bonusXP: streakDay.BonusXP ?? 0,
            bonusLevel: streakDay.BonusLevels ?? 0,
            streakMultiplier: streakDay.Multiplier ?? "N/A",
        }
    }
    if (!streakDay.MessageTemplateId) return
    const streakDayTemplate = await database.messageTemplates.findFirst({
        where: {
            Name: streakDay.MessageTemplateId
        }
    })
    const messageBuilder = await MessageBuilder(streakDayTemplate, streakPlaceholder)
    // user channel custom
    switch (data.XPStreaksMessageType) {
        case "channel": {
            await (channel as GuildTextBasedChannel).send(messageBuilder.messageData)
        }
            break
        case "custom": {
            const channelId = data.XPStreaksMessageChannelId
            if (!channelId) return
            const channel = await guild.channels.fetch(channelId) as GuildTextBasedChannel
            await channel.send(messageBuilder.messageData)
        }
            break
        case "user": {
            await member.createDM(true)
            await member.send(messageBuilder.messageData)
        }
            break
    }

}

export async function scheduleLevelXPDrops(client: ExtendedClient) {
    try {

        const data = await database.levelSettings.findMany({
            include: {
                XPDrops: true
            }
        })

        if (!data) return
        for (const settings of data) {
            if (!settings.GuildId) continue
            if (!settings.IsLevelModuleEnabled) continue
            if (!settings.XPDropsMessageTemplate) continue
            const guild = await client.guilds.fetch(settings.GuildId)
            if (!guild) continue
            if (settings.XPDrops.length <= 0) continue


            for (const drop of settings.XPDrops) {
                if (!drop.ExpireTime) continue

                try {
                    const spawnedAt = new Date(drop.LastSpawned).getTime();
                    const expireTime = ms(drop.ExpireTime as StringValue);
                    const expireTimestamp = spawnedAt + expireTime;

                    if (Date.now() > expireTimestamp) {
                        for (const messageData of drop.MessageIdsToDelete) {
                            const channelId = messageData.split("-")[0]
                            const messageId = messageData.split("-")[1];
                            await (await ((await guild.channels.fetch(channelId)) as GuildTextBasedChannel).messages.fetch(messageId)).delete()
                        }
                        await database.xPDrops.update({
                            where: {
                                UUID: drop.UUID
                            },
                            data: {
                                MessageIdsToDelete: {
                                    set: []
                                }
                            }
                        })
                    }
                } catch (e) {
                    continue
                }

                // Check Spawn
                const last = new Date(drop.LastSpawned).getTime()
                const msRespawn = ms(drop.TimeToRespawn as StringValue)
                const timestamp = last + msRespawn
                const now = Date.now()
                if (now > timestamp) {
                    const allClaimedUsers = await database.levels.findMany({
                        where: {
                            ClaimedXPDrops: {
                                has: drop.UUID
                            }
                        }
                    })
                    await database.xPDrops.update({
                        where: {
                            UUID: drop.UUID
                        },
                        data: {
                            LastSpawned: null
                        }
                    })
                    for (const claimedUser of allClaimedUsers) {
                        const update = claimedUser.ClaimedXPDrops.filter((f) => f != drop.UUID)
                        await database.levels.update({
                            where: {
                                UUID: claimedUser.UUID
                            },
                            data: {
                                ClaimedXPDrops: {
                                    set: update
                                }
                            }
                        })
                    }

                    if (drop.LastSpawned) return

                    const placeholder = {
                        drop: {
                            xpRange: drop.XPRange,
                            claimAmount: drop.ClaimAmount,
                            timeToRespawn: drop.TimeToRespawn
                        }
                    }


                    const template = await database.messageTemplates.findFirst(
                        {
                            where: {
                                Name: settings.XPDropsMessageTemplate ?? ""
                            }
                        }
                    )
                    if (!template) continue
                    const messageBuilder = await MessageBuilder(
                        template,
                        placeholder,
                    )

                    const randNumberForChannel = Math.round(Math.random() * drop.ChannelIds.length)
                    const channel = await guild.channels.fetch(drop.ChannelIds[randNumberForChannel]) as GuildTextBasedChannel
                    if (!channel) continue

                    const msg1 = await channel.send(messageBuilder.messageData)
                    try {
                        const msg2 = await channel.send({
                            flags: MessageFlags.IsComponentsV2,
                            components: [
                                new ActionRowBuilder<ButtonBuilder>().addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("level-drop-claim:" + drop.UUID + ":" + msg1.id)
                                        .setLabel("Claim Drop")
                                        .setEmoji("<:package:1365715766623604746>")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                            ]
                        })

                        await database.xPDrops.update({
                            where: {
                                UUID: drop.UUID
                            },
                            data: {
                                MessageIdsToDelete: {
                                    set: [`${msg1.channel.id}-${msg1.id}`, `${msg2.channel.id}-${msg2.id}`]
                                }
                            }
                        })

                    } catch (e) {

                    }

                    await database.xPDrops.update({
                        where: {
                            UUID: drop.UUID
                        },
                        data: {
                            LastSpawned: new Date().toISOString(),
                        }
                    })
                }
            }
        }
    } catch (error) {
        return
    }
}