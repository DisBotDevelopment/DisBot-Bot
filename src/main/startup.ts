import "dotenv/config";
import colors from "colors";
import {ShardingManager} from "discord.js";
import {Logger} from "./logger.js";
import {Config, configStartup} from "./config.js"
import * as process from "node:process";

colors.enable();

await configStartup().then(() => Logger.info("Loaded Configuration (1/2)"))
Logger.info(`Running on ${process.env.ENVIRONMENT} Environment.`.cyan)
const shardList = Config.Bot.ShardList.split(",").map(Number)


Logger.info("Starting Shard Manager from discord.js")
const manager = new ShardingManager("./src/main/bot.ts", {
    token: Config.Bot.DiscordBotToken,
    totalShards: Number(Config.Bot.ShardCount),
    shardList: Config.Bot?.ShardList.length <= 0 ? "auto" : Config.Bot.ShardList.split(",").map(Number),
    mode: "process",
    respawn: true,

});

Logger.info("Starting Shards with Id " + Config.Bot?.ShardList.length)
manager.on("shardCreate", (shard) => {
    Logger.info(`Shard ${shard.id} launched`.italic, {
        label: "ShardManager",
        level: "info",
        botType: Config.BotType,
        timestamp: new Date().toISOString(),
    });
});

Logger.info("Spawning Cluster from Manager.");
manager.spawn({timeout: -1}).then(r =>
    Logger.info(`Spawned Cluster with Shards: ${shardList}`.magenta));

