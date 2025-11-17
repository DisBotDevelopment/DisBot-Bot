import {
    AttachmentBuilder,
    BaseInteraction,
    Events,
    GuildTextBasedChannel,
    Message, VoiceChannel,
    VoiceState,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {calcXP, levelUpHelper, manageXPStreakDays} from "../../../systems/level/levelMath.js";
import {randomUUID} from "crypto";
import ms, {StringValue} from "ms";


export default {
    name: Events.VoiceStateUpdate,

    /**
     *
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     * @param {ExtendedClient} client
     */
    async execute(oldState: VoiceState, newState: VoiceState, client: ExtendedClient) {

        const guild = newState.guild;
        const member = newState.member;
        const channel = newState.channel as VoiceChannel;

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
        if (!data.IsVoiceXPEnabled) return
        const user = await client.users.fetch(newState.member.id)
        if (user.bot) return
        if (!data.VoiceXPCooldown) return

        if (client.cooldowns.has(`${guild.id}-level-voice`)) {
            const timer = client.cooldowns.get(`${guild.id}-level-voice`) as NodeJS.Timeout
            timer.close()
        }

        const interval = setInterval(async () => {

            let userData = await database.levels.findFirst({
                where: {
                    UserId: member.id,
                    GuildId: guild.id
                }
            })

            if (!userData) {
                await database.levels.create({
                    data: {
                        Users: {
                            connectOrCreate: {
                                create: {
                                    Username: member.user.username,
                                    UserId: member.id,
                                },
                                where: {
                                    UserId: member.id,
                                }
                            }
                        },
                        LevelSettings: {
                            connect: {
                                GuildId: guild.id
                            }
                        },
                        XP: "0",
                        ClaimedXPDrops: [],
                        CurrentStreakDay: 0,
                        RequiredXp: String(data.RequiredXPForFirstLevel),
                        Level: 0,
                        UUID: randomUUID(),
                    }
                })
                userData = await database.levels.findFirst({
                    where: {
                        UserId: member.id,
                        GuildId: guild.id
                    }
                })
            }
            const guildMember = await guild.members.fetch(userData.UserId)
            if (guildMember.voice?.channelId == null) return

            if (data.ExcludeUserIds.length > 0) {
                for (const userId of data.ExcludeUserIds) {
                    if (member.id == userId) return
                }
            }
            if (data.ExcludeRoleIds.length > 0) {
                for (const roleId of data.ExcludeRoleIds) {
                    if (member.roles.cache.has(roleId)) return
                }
            }
            if (data.ExcludedChannelIds.length > 0) {
                for (const channelId of data.ExcludedChannelIds) {
                    if (channelId == channelId) return
                }
            }

            function voiceXP() {
                const voiceXPRange = data.VoiceXPRange
                let xpCalculation = calcXP(parseInt(voiceXPRange.split("-")[0]), parseInt(voiceXPRange.split("-")[1]))
                if (userData?.CurrentStreakDay != 0) {
                    if (data.XPStreaks.length > 0 && data.XPStreaks[userData?.CurrentStreakDay]) {
                        const streak = data.XPStreaks[userData?.CurrentStreakDay]
                        if (!streak) return xpCalculation
                        xpCalculation *= streak.Multiplier
                    }
                }
                return xpCalculation
            }

            const voiceXPData = voiceXP()
            await database.levels.update({
                where: {
                    GuildId: guild.id,
                    UserId: member.id,
                    UUID: userData.UUID
                },
                data: {
                    XP: `${(parseInt(userData.XP) + voiceXPData)}`,
                }
            })
            userData = await database.levels.findFirst({
                where: {
                    UserId: member.id,
                    GuildId: guild.id
                }
            })

            await levelUpHelper(
                member,
                guild,
                channel,
            )
            await manageXPStreakDays(
                guild,
                member,
                channel,
                "voice"
            )
        }, ms(data.VoiceXPCooldown as StringValue))

        client.cooldowns.set(`${guild.id}-level-voice`, interval)
    }
}

