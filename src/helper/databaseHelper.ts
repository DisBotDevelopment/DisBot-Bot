import {ExtendedClient} from "../types/client.js";
import {default as axios} from "axios";
import {database} from "../main/database.js";
import {botData} from "../main/version.js";
import {Logger} from "../main/logger.js";
import {LoggingAction} from "../enums/loggingTypes.js";
import colors from "colors"
import {User} from "discord.js";
import {Config} from "../main/config.js";

colors.enable();

export async function setupDisBotConfig(client: ExtendedClient): Promise<void> {

    try {
        const fetchTwitchToken = await axios.post(
            `https://id.twitch.tv/oauth2/token?client_id=dtqw2suy9vbzzhpoure8ibuq8r0vnj&client_secret=a3jr6v2444vf8z7ynk5b17ogf5d9rt&grant_type=client_credentials`
        );

        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    btoa(
                        Config.Modules.Notifications.SpotifyClientId + ":" + Config.Modules.Notifications.SpotifyClientSecret
                    ),
            },
            body: "grant_type=client_credentials",
        });
        const authData = await result.json() as { access_token: string };

        const twitchAccessToken = fetchTwitchToken.data.access_token;

        const disbotConfig = await database.disBot.findFirst({
            where: {
                GetConf: "config"
            }
        })
        if (!disbotConfig) {
            await database.disBot.create({
                data: {
                    GetConf: "config",
                    Version: botData.version,
                    Logs: [],
                    SpotifyToken: authData.access_token,
                    TwitchToken: twitchAccessToken
                }
            })
        }

        Logger.info(
            {
                guildId: "0",
                userId: "0",
                channelId: "0",
                messageId: "0",
                timestamp: new Date().toISOString(),
                level: "info",
                label: "Database",
                message: `DisBot Database Config loaded and updated`.gray,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Database,
            }
        );
    } catch (error) {
        Logger.error(
            {
                guildId: "0",
                userId: "0",
                channelId: "0",
                messageId: "0",
                timestamp: new Date().toISOString(),
                level: "error",
                label: "Database",
                message: `DisBot Database Config loading failed with ${error}`.red,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Database,
            }
        );
    }
}

export async function initGuildsToDatabase(client: ExtendedClient) {
    const allGuilds = await client.guilds.fetch();

    allGuilds.forEach(async (guild) => {
        // Init Guilds
        const guildsData = await database.guilds.findFirst({
            where: {
                GuildId: guild.id
            }
        })

        const guildOwner = await client.guilds.fetch(guild.id)
        if (!guildsData) await database.guilds.create({
            data: {
                GuildId: guild.id,
                GuildName: guild.name,
                GuildOwner: guildOwner.id
            }
        })
    })
}

export async function initUsersToDatabase(client: ExtendedClient, user: User) {

    // Init Users
    const usersData = await database.users.findFirst({
        where: {
            UserId: user.id
        }
    })
    if (!usersData) await database.users.create({
        data: {
            UserId: user.id,
            Username: user.username
        }
    })
}