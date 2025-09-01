import {api} from "../api/restAPI/api.js";
import {app} from "../api/services/app.js";
import {emojiCache} from "../api/services/emojiCache.js";
import {vanityAPI} from "../api/services/vanity.js";
import {vote} from "../api/services/vote.js";
import {ActivityType, Guild, PresenceStatusData, PresenceUpdateStatus} from "discord.js";
import {Logger} from "../main/logger.js";
import {botData} from "../main/version.js";
import {giveaway} from "../systems/giveaway.js";
import {guildFetcher} from "../systems/inviteTracker/guildFetcher.js";
import {banScheduled} from "../systems/moderation/ban.js";
import {Scheduler} from "../systems/Scheduler.js";
import {spotify} from "../systems/spotify.js";
import {checkTwitch} from "../systems/twitch.js";
import {checkYoutube} from "../systems/youtube.js";
import {ExtendedClient} from "../types/client.js";
import {LoggingAction} from "../enums/loggingTypes.js";
import * as process from "node:process";
import {Config} from "../main/config.js";

export async function clientReady(client: ExtendedClient) {
    try {
        client.guilds.cache.forEach(async (guild: Guild) => {
            await guildFetcher(client, guild);
        })

        // Moderation && Giveaway
        setInterval(async () => {
            banScheduled(client);
            giveaway(client);
            Scheduler.scheduleTicketsDeleteAfterTimeAndInactivity(client)
        }, 10000);

        // AutoDelete
        await Scheduler.deleteMessagesFromAutoDelete(client);

        // Schedule Vanity URL's && Vote Role on Guild
        setInterval(async () => {
            Scheduler.checkLast30DaysVanities(client);
            Scheduler.checkVoteRoles(client);
        }, 86400000); // 24 hours

        // Notfiy
        setInterval(async () => {
            checkYoutube(client);
            checkTwitch(client);
            spotify(client);
        }, 30000);

        // API
        await api(client);
        await emojiCache(client);


        client.user.presence.set({
            status: PresenceUpdateStatus.Online,
            activities: [
                {
                    type: ActivityType.Custom,
                    name: `disbot.app | 🧪 ${botData.version}`,
                },
            ],
        });

        // API Entypoint
        await vote(client);
        await app(client);
        await vanityAPI(client);

        client.user.presence.set({
            status: PresenceUpdateStatus.Online,
            activities: [
                {
                    type: ActivityType.Custom,
                    name: `disbot.app | 🧪 ${botData.version}${Config.Bot.DiscordApplicationId == "1154097245105422427" ? "dev" : ""}`,
                },
            ],
        });

        // const commandsJson = client.commands?.map((command: any) => ({
        //     name: command.data?.name,
        //     description: command.data?.description,
        //     options: command.data?.options,
        //     type: command.data?.integration_types,
        //     default_member_permissions: command.data?.default_member_permissions,
        // }));

        // await axios.post(`https://discordbotlist.com/api/v1/bots/disbot/commands`,
        //     JSON.stringify(commandsJson),
        //     {
        //         headers: {
        //             Authorization: `Bot ${process.env.DC_BOT_LIST_TOKEN}` as string,
        //             "Content-Type": "application/json",
        //         },
        //     });

        Logger.info({
            timestamp: new Date().toISOString(),
            level: "info",
            label: "Ready",
            message: `Connected to gateway as ${client.user.displayName} (${client.user.id})`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Event,
        });
    } catch (error) {
        Logger.error({
            timestamp: new Date().toISOString(),
            level: "error",
            label: "Ready",
            message: `Error during client ready event: ${error instanceof Error ? error.message : String(error)}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Event,
        });
    }
}