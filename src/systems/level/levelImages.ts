import {Font, LeaderboardBuilder, RankCardBuilder} from "canvacord";
import {Guild, GuildMember} from "discord.js";
import {database} from "../../main/database.js";
import {uploadToCDN} from "../../helper/utilityHelper.js";

export async function generateLevelCardImage(user: GuildMember, guildId: string) {

    const levelData = await database.levels.findFirst({
        where: {
            UserId: user.id,
            GuildId: guildId
        }
    })
    if (!levelData) return null

    Font.loadDefault()
    const image = new RankCardBuilder()
        .setUsername(user.user.username)
        .setLevel(levelData.Level)
        .setRequiredXP(Number(levelData.RequiredXp))
        .setAvatar(user.displayAvatarURL({extension: "png", forceStatic: true}) ?? "https://cdn.discordapp.com/emojis/1259432940383768647.webp?size=96/mes")
        .setCurrentXP(Number(levelData.XP))


    const buffer = await image.build({format: "png"})
    if (Buffer.isBuffer(buffer)) {
        return await uploadToCDN(buffer)
    }
    return null
}

export async function generateLevelLeaderboard(guild: Guild, type: "default" | "horizontal", playerData: any) {
    const data = await database.levels.findMany({
        include: {
            LevelSettings: true
        },
        where: {
            GuildId: guild.id
        }
    })

    let allXP: number = 0
    data.map((x) => x.XP).forEach((n) => {
        allXP += parseInt(n)
    })

    const players = await Promise.all(
        playerData
            .map(async (user, rank) => {
                try {
                    const position = data.filter((f) => f.UserId == user.UserId).map((i, c) => {
                        return c
                    })[0]
                    const guildMember = await guild.members.fetch(user.UserId);
                    return {
                        level: user.Level ?? 0,
                        username: guildMember?.user?.username ?? "N/A",
                        displayName: guildMember?.displayName ?? "N/A",
                        avatar: guildMember?.displayAvatarURL({extension: "png", forceStatic: true}) ?? "https://cdn.discordapp.com/emojis/1259432940383768647.webp?size=96",
                        xp: Number(user.XP) ?? 0,
                        rank:  (rank + 1)
                    };
                } catch (error) {
                    return
                }
            })
    )

    Font.loadDefault()
    const leaderboard = new LeaderboardBuilder()
        .setHeader({
            title: `Level Leaderboard`,
            image: guild.iconURL({extension: "png", forceStatic: true}),
            subtitle: `Total Members: ${data.length}/${guild.memberCount} - Global XP ${allXP}`,
        })
        .setPlayers(players)
        .setVariant(type)


    const image = await leaderboard.build({format: "png"})
    if (Buffer.isBuffer(image)) {
        return await uploadToCDN(image)
    }
    return null
}