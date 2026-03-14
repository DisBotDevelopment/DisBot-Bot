import {Font, LeaderboardBuilder, RankCardBuilder} from "canvacord";
import {type FetchMemberOptions, type FetchMembersOptions, Guild, GuildMember, type UserResolvable} from "discord.js";
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
        .setLevel(levelData.Level ?? 0)
        .setRequiredXP(Number(levelData.RequiredXp))
        .setAvatar(user.displayAvatarURL({
            extension: "png",
            forceStatic: true
        }) ?? "https://cdn.discordapp.com/embed/avatars/0.png")
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
        allXP += parseInt(n ?? "0")
    })

    const players = await Promise.all(
        playerData
            .map(async (user: {
                UserId: UserResolvable | FetchMemberOptions | (FetchMembersOptions & { user: UserResolvable; });
                Level: any;
                XP: any;
            }, rank: number) => {
                try {
                    /*
                const position = data.filter((f) => f.UserId == user.UserId).map((i, c) => {
                    return c
                })[0]
                 */
                    const guildMember = await guild.members.fetch(user.UserId);
                    if (guildMember) {
                        return {
                            level: user.Level ?? 0,
                            username: guildMember?.user?.username ?? "N/A",
                            displayName: guildMember?.displayName ?? "N/A",
                            avatar: guildMember.displayAvatarURL({
                                extension: "png",
                                forceStatic: true
                            }) ?? "https://cdn.discordapp.com/embed/avatars/0.png",
                            xp: Number(user.XP) ?? 0,
                            rank: (rank + 1)
                        };
                    }
                } catch (e) {
                    return {
                        level: user.Level ?? 0,
                        username: user?.UserId ?? "N/A",
                        displayName: user?.UserId ?? "N/A",
                        avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
                        xp: Number(user.XP) ?? 0,
                        rank: (rank + 1)
                    };
                }
            })
    )

    Font.loadDefault()
    const leaderboard = new LeaderboardBuilder()
        .setHeader({
            title: `Level Leaderboard`,
            image: guild.iconURL({
                extension: "png",
                forceStatic: true
            }) ?? "https://cdn.discordapp.com/embed/avatars/0.png",
            subtitle: `Total Members: ${data.length}/${guild.memberCount} - Global XP ${allXP}`,
        })
        .setPlayers(players)
        .setVariant(type)

    const image = await leaderboard.build()
    if (Buffer.isBuffer(image)) {
        return await uploadToCDN(image)
    }
    return null
}