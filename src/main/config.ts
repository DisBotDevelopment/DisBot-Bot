import YAML from "yaml";
import fs from "fs";
import {Logger} from "./logger.js";
import {LoggingAction} from "../enums/loggingTypes.js";
import {botData} from "./version.js";
import colors from "colors";
import {DisBotConfigData} from "../types/config.js";

colors.enable();

export let Config: DisBotConfigData

export async function configStartup() {
    const fileCheck = fs.existsSync(`${process.cwd()}/config.yml`);
    if (!fileCheck) {
        const configData: DisBotConfigData = {
            Bot: {
                DiscordBotToken: "",
                DiscordApplicationId: "",
                DiscordClientSecret: "",
                AdminGuildId: "",
                ShardCount: 0,
                ShardList: "",
            },
            Modules: {
                Verification: {
                    VerifyRedirectUrl: "",
                    VerifyAuthUrl: "",
                },
                Bot: {
                    NewsChannel1: "",
                    NewsChannel2: "",
                    NewsChannel3: "",
                    NewsChannel4: "",
                },
                Customer: {
                    PelicanApi: "",
                    PelicanClientApiToken: "",
                    PelicanClientApi: "",
                    PelicanApplicationApi: "",
                },
                Notifications: {
                    SpotifyClientId: "",
                    SpotifyClientSecret: "",
                    TiktokClientKey: "",
                    TiktokClientSecret: "",
                },
            },
            Other: {
                Vote: {
                    DcBotListToken: "",
                    DcBotListSecret: "",
                    TopggToken: "",
                    VotePort: 0,
                },
                AppPort: 0,
                AiPort: 0,
                VanityPort: 0,
                EventsApi: {
                    ApiKey: "",
                    ApiPort: 0,
                },
                WsPort: 0,
                API: {
                    ApiPort: 0,
                    ApiKey: "",
                },
            },
            Database: {
                MongodbUrl: "",
                DbName: "",
            },
            Logging: {
                BotLoggingApiPort: 0,
                BotLoggingPassword: "",
                ErrorWebhook: "",
                BotLogger: "",
            },
            BotType: "",
            CONFIG_VERSION: botData.configVersion,
        };

        fs.writeFileSync(
            `${process.cwd()}/config.yml`,
            YAML.stringify(configData)
        );
    }

    const file = fs.readFileSync(`${process.cwd()}/config.yml`, "utf8");
    const ymlData = YAML.parse(file);
    Config = ymlData;

    Logger.info({
        guildId: "0",
        userId: "0",
        channelId: "0",
        messageId: "0",
        timestamp: new Date().toISOString(),
        level: "info",
        label: "Config",
        message: `DisBot Config is loaded and exported!`,
        botType: "Unknown",
        action: LoggingAction.Other,
    });

    if (Config.CONFIG_VERSION != botData.configVersion) {
        Logger.error({
            guildId: "0",
            userId: "0",
            channelId: "0",
            messageId: "0",
            timestamp: new Date().toISOString(),
            level: "error",
            label: "Config",
            message: `Please recreate your Bot Config`.red,
            botType: "Unknown",
            action: LoggingAction.Other,
        });
        process.exit(0);
    }
}