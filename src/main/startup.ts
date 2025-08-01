import * as Sentry from "@sentry/node";
import "dotenv/config";
import colors from "colors";
import {ShardingManager} from "discord.js";
import {Logger} from "./logger.js";
import {Config, configStartup} from "./config.js";

colors.enable();

await configStartup();

Sentry.init({
    dsn: Config.Logging.SentryDsn,
    sendDefaultPii: true,
});

if (Config.BotType == "DISBOT") {
    const manager = new ShardingManager("./.build/src/main/bot.js", {
        token: Config.Bot.DiscordBotToken,
        totalShards: Number(Config.Bot.ShardCount),
        shardList: Config.Bot?.ShardList.length <= 0 ? null : Config.Bot.ShardList.split(",").map(Number),
        mode: "process",
        respawn: true,
    });

    manager.on("shardCreate", (shard) => {
        Logger.info(`Shard ${shard.id} launched`, {
            label: "ShardManager",
            level: "info",
            botType: Config.BotType,
            timestamp: new Date().toISOString(),
        });
    });

    manager.spawn({timeout: -1});
} else if (Config.BotType == "CUSTOMER") {
    const manager = new ShardingManager("./.build/src/main/bot.js", {
        token: Config.Bot.DiscordBotToken,
        totalShards: 1,
        mode: "process",
        respawn: true,
        //silent: false
    });

    manager.on("shardCreate", (shard) => {
        console.log(colors.cyan(`Shard ${shard.id} launched`));
    });
    manager.spawn({timeout: -1});
}
