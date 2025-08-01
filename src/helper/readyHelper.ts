import {setupSocketIO} from "../api/eventsAPI/server.js";
import {api} from "../api/restAPI/api.js";
import {app} from "../api/services/app.js";
import {emojiCache} from "../api/services/emojiCache.js";
import {loggerApi} from "../api/services/loggerApi.js";
import {vanityAPI} from "../api/services/vanity.js";
import {vote} from "../api/services/vote.js";
import {ActivityType, Guild, PresenceStatusData, PresenceUpdateStatus} from "discord.js";
import {Logger} from "../main/logger.js";
import {botData} from "../main/version.js";
import {customerDB} from "../../templates/unusedModules/customer/customerDB.js";
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
        }, 10000);

        // AutoDelete
        await Scheduler.deleteMessagesFromAutoDelete(client);

        // Schedule Vanity URL's
        setInterval(async () => {
            Scheduler.checkLast30DaysVanities(client);
        }, 86400000); // 24 hours

        // Notfiy
        setInterval(async () => {
            checkYoutube(client);
            checkTwitch(client);
            spotify(client);
        }, 30000);

        // API
        await api(client);
        await loggerApi(client);
        await setupSocketIO(client);
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

        if (!client.user) throw new Error("Client is not ready yet");
        if (
            Config.BotType.toString() == "DISBOT"
        ) {

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
        } else {
            // Customer Status Update
            // TODO: Currently unused!

            const data = await customerDB.findOne({Application: client.user.id});
            if (data)
                await customerDB.findOneAndUpdate(
                    {Application: client.user.id},
                    {
                        GuildID: client.guilds.cache.map((guild: { id: any; }) => guild.id),
                        //     ServerPort: process.env.SERVER_PORT,
                    }
                );

            if (data) {
                if (data.BotStatus) {
                    client.user.setPresence({
                        status: data.BotStatus.Status as PresenceStatusData,
                        activities: [
                            {
                                name: data.BotStatus.Text as string,
                                type: data.BotStatus.Type as ActivityType,
                            },
                        ],
                    });
                }
            }

            client.user.presence.set({
                status: PresenceUpdateStatus.Idle,
                activities: [
                    {
                        type: ActivityType.Custom,
                        name: `📚 Manage with /customer`,
                    },
                ],
            });
        }

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