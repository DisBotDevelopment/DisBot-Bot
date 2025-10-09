import {ActivityType, Events, Guild, PresenceUpdateStatus} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {guildFetcher} from "../../../systems/inviteTracker/guildFetcher.js";
import {banScheduled} from "../../../systems/moderation/ban.js";
import {giveaway} from "../../../systems/giveaway.js";
import {Scheduler} from "../../../systems/Scheduler.js";
import {CommandHelper} from "../../../helper/CommandHelper.js";
import {checkYoutube} from "../../../systems/youtube.js";
import {checkTwitch} from "../../../systems/twitch.js";
import {spotify} from "../../../systems/spotify.js";
import {api} from "../../../api/restAPI/api.js";
import {emojiCache} from "../../../api/services/emojiCache.js";
import {vote} from "../../../api/services/vote.js";
import {app} from "../../../api/services/app.js";
import {vanityAPI} from "../../../api/services/vanity.js";
import {Logger} from "../../../main/logger.js";
import {Config} from "../../../main/config.js";
import {LoggingAction} from "../../../enums/loggingTypes.js";
import {initDataToDatabase} from "../../../main/database.js";
import {versionData} from "../../../main/version.js";

export default {
    name: Events.ClientReady,
    async execute(client: ExtendedClient) {
        try {
            // INFO: Only a little await because I have to load everything here since I definitely have a client here, 
            // and therefore no await that everything is loaded correctly and then loads in sequence...
            // (This events load everything sync and then the functions that need longer they load longer but all functions will be loaded!!!)

            // Database init (Default)
            initDataToDatabase(client)

            // Load Commands
            CommandHelper.loadCommands(client);
            CommandHelper.adminGuildLoadCommands(client);

            // Invite Tracker Fetch
            client.guilds.cache.forEach(async (guild: Guild) => {
                guildFetcher(client, guild);
            })

            // Moderation && Giveaway
            setInterval(async () => {
                banScheduled(client);
                giveaway(client);
                Scheduler.scheduleTicketsDeleteAfterTimeAndInactivity(client)
            }, 10000);

            // AutoDelete
            Scheduler.deleteMessagesFromAutoDelete(client);

            // Run Guild Commands
            const guilds = await client.guilds.fetch();
            for (const fakeGuild of guilds.values()) {
                const guild = await client.guilds.fetch(fakeGuild.id)
                CommandHelper.loadCommandsForGuild(client, guild);
            }

            // Schedule Vanity URL's && Vote Role on Guild
            setInterval(async () => {
                Scheduler.checkLast30DaysVanities(client);
                Scheduler.checkVoteRoles(client);
            }, 86400000); // 24 hours

            // Notfiy && Polls
            setInterval(async () => {
                checkYoutube(client);
                checkTwitch(client);
                spotify(client);
                Scheduler.schedulePolls(client);
            }, 30000);

            // API && Version 
            await api(client);
            await emojiCache(client);
            await versionData(client)

            // API Entypoint
            await vote(client);
            await app(client);
            await vanityAPI(client);

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
}