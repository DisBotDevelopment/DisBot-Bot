import {
    Events, Guild
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {guildFetcher} from "../../../systems/inviteTracker/guildFetcher.js";
import {banScheduled} from "../../../systems/moderation/ban.js";
import {giveaway} from "../../../systems/giveaway.js";
import {Scheduler} from "../../../systems/Scheduler.js";
import {checkYoutube} from "../../../systems/youtube.js";
import {checkTwitch} from "../../../systems/twitch.js";
import {spotify} from "../../../systems/spotify.js";
import {Logger} from "../../../main/logger.js";
import {Config} from "../../../main/config.js";
import {LoggingAction} from "../../../enums/loggingTypes.js";
import {scheduleLevelXPDrops} from "../../../systems/level/levelMath.js";

export default {
    name: Events.ClientReady,
    async execute(client: ExtendedClient) {
        try {

            // Invite Tracker Fetch
            client.guilds.cache.forEach(async (guild: Guild) => {
                guildFetcher(client, guild);
            })

            // Spawn Drops...
            setInterval(() => {
                scheduleLevelXPDrops(client);
            }, 5000)

            // Moderation && Giveaway
            setInterval(async () => {
                banScheduled(client);
                giveaway(client);
                Scheduler.scheduleTicketsDeleteAfterTimeAndInactivity(client)
            }, 10000);

            // AutoDelete
            Scheduler.deleteMessagesFromAutoDelete(client);

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
            }, 300000);

            Logger.info({
                timestamp: new Date().toISOString(),
                level: "info",
                label: "Ready",
                message: `Connected to gateway as ${client.user?.displayName} (${client.user?.id})`,
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